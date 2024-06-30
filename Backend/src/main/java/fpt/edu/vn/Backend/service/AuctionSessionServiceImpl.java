package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "auctionSession")
public class AuctionSessionServiceImpl implements AuctionSessionService {
    private final AuctionSessionRepos auctionSessionRepos;
    private static final Logger logger = LoggerFactory.getLogger(AuctionSessionServiceImpl.class);
    private final AccountRepos accountRepos;
    private final DepositRepos depositRepos;
    private final PaymentRepos paymentRepos;
    private final BidRepos bidRepos;
    private final BidService bidService;
    private final PaymentService paymentService;
    private final AccountServiceImpl accountServiceImpl;

    @Autowired

    private ItemRepos itemRepos;

    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private OrderServiceImpl orderServiceImpl;


    @Autowired
    public AuctionSessionServiceImpl(AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos, DepositRepos depositRepos, PaymentRepos paymentRepos, BidRepos bidRepos, BidService bidService, PaymentService paymentServiceImpl, AccountServiceImpl accountServiceImpl) {

        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
        this.depositRepos = depositRepos;
        this.paymentRepos = paymentRepos;
        this.bidRepos = bidRepos;
        this.bidService = bidService;
        this.paymentService = paymentServiceImpl;
        this.accountServiceImpl = accountServiceImpl;
    }

    @Override
    @CacheEvict(value = "auctionSession", allEntries = true)
    public AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId) {
        Account a = accountRepos.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account not found:" + accountId));
        AuctionSession auctionSession = auctionSessionRepos.findById(auctionSessionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction session not found:" + auctionSessionId));
        List<Item> items = new ArrayList<>();
        for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
            items.add(auctionItem.getItem());
        }
        if (items.isEmpty()) {
            throw new ResourceNotFoundException("No items found in auction session");
        }
        items.sort(Comparator.comparing(Item::getReservePrice));
        BigDecimal minPrice = new BigDecimal(100);
        BigDecimal maxPrice = new BigDecimal(1000);
        BigDecimal depositAmount = items.get(0).getReservePrice()
                .multiply(new BigDecimal("4.5"))
                .divide(new BigDecimal(100));
        if (depositAmount.compareTo(minPrice) < 0) {
            depositAmount = minPrice;
        }
        if (depositAmount.compareTo(maxPrice) > 0) {
            depositAmount = maxPrice;
        }
        if (a.getBalance().compareTo(depositAmount) >= 0) {
            auctionSession.getDeposits().stream().filter(deposit -> deposit.getPayment().getAccount().getAccountId() == accountId)
                    .findFirst().ifPresent(deposit -> {
                        throw new InvalidInputException("Account already registered for auction session");
                    });
            a.setBalance(a.getBalance().subtract(depositAmount));
            accountRepos.save(a);
            Payment payment = new Payment();
            payment.setAccount(a);
            payment.setPaymentAmount(depositAmount);
            payment.setType(Payment.Type.AUCTION_DEPOSIT);
            payment.setStatus(Payment.Status.PENDING);
            payment.setCreateDate(LocalDateTime.now());
            payment = paymentRepos.save(payment);

            Deposit deposit = new Deposit();
            deposit.setAuctionSession(auctionSession);
            deposit.setPayment(payment);
            deposit = depositRepos.save(deposit);

            auctionSession.getDeposits().add(deposit);
            auctionSessionRepos.save(auctionSession);

            return new AuctionSessionDTO(auctionSession);
        } else {
            throw new ResourceNotFoundException("Account balance is not enough to register for auction session");
        }
    }

    @Override
    @CacheEvict(value = "auctionSession", allEntries = true)
    public String placePreBid(int auctionSessionId, int accountId, double amount) {
        return "";
    }

    @Override
    @CacheEvict(value = "auctionSession", allEntries = true)
    public boolean assignAuctionSession(AssignAuctionItemDTO assign) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(assign.getAuctionSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Auction Session not found: " + assign.getAuctionSessionId()));

            List<AuctionItem> auctionItemList = new ArrayList<>();
            for (Integer itemIds : assign.getItem()) {
                Item item = itemRepos.findById(itemIds)
                        .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemIds));

                AuctionItem auctionItem = new AuctionItem();
                auctionItem.setAuctionSession(auctionSession);
                auctionItem.setItem(item);
                auctionItem.setCreateDate(LocalDateTime.now());
                auctionItem.setUpdateDate(LocalDateTime.now());
                auctionItem.setCurrentPrice(item.getReservePrice()); // Buy in price

                auctionItemRepos.save(auctionItem);
                auctionItemList.add(auctionItem);
            }

            auctionSession.setAuctionItems(auctionItemList);
            auctionSessionRepos.save(auctionSession);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @CacheEvict(value = "auctionSession", allEntries = true)
    @Override
    public AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO) {
        if (auctionDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("Start date must be in the future");
        }
        if (auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())) {
            throw new InvalidInputException("End date must be after start date");
        }
        try {
            AuctionSession auctionSession = new AuctionSession();
            auctionSession.setTitle(auctionDTO.getTitle());
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));
            AuctionSession savedAuctionSession = auctionSessionRepos.save(auctionSession);

            auctionDTO.setAuctionSessionId(savedAuctionSession.getAuctionSessionId());
            return auctionDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error creating auction session", e);
        }
    }

    @Override
    @CacheEvict(value = "auctionSession", allEntries = true)
    public void finishAuction(int auctionSessionId) {
        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        Map<AccountDTO, List<Integer>> winAccounts = new HashMap<>();
        logger.info("Finishing auction session " + auctionSessionId);
        if (auctionDTO.getStatus().equals("FINISHED") || auctionDTO.getStatus().equals("TERMINATED")) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        for (AuctionItemDTO auctionItem : auctionDTO.getAuctionItems()) {
            bidService.finishAuctionItem(auctionItem.getId());
            AccountDTO account;
            account = accountServiceImpl.getAccountById(bidService.getHighestBid(auctionItem.getId())
                    .getPayment().getAccountId());
            if (account == null) {
                continue;
            }
            List<Integer> winItems = winAccounts.get(account);
            if (winItems == null || winItems.isEmpty()) {
                winItems = new ArrayList<>();
                winItems.add(auctionItem.getItemDTO().getItemId());
            } else {
                winItems.add(auctionItem.getItemDTO().getItemId());
            }
            winAccounts.put(account, winItems);
        }
        winAccounts.forEach((account, items) -> {
            logger.info("Winning account: " + account.getAccountId() + " items: " + items);
        });
        for (DepositDTO deposit : auctionDTO.getDeposits()) {
            if (deposit.getPayment().getStatus().equals(Payment.Status.SUCCESS)) {
                continue;
            }
            if (winAccounts.keySet().stream()
                    .anyMatch(account ->
                            account.getAccountId() == deposit.getPayment().getAccountId())) {
                deposit.getPayment().setStatus(Payment.Status.SUCCESS);
                paymentService.updatePayment(deposit.getPayment());
                continue;
            }
            if (!winAccounts.isEmpty() && winAccounts.keySet().stream()
                    .noneMatch(account ->
                            account.getAccountId() == deposit.getPayment().getAccountId())) {
                deposit.getPayment().setStatus(Payment.Status.FAILED);
                accountRepos.findById(deposit.getPayment().getAccountId()).ifPresent(account -> {
                    account.setBalance(account.getBalance().add(deposit.getPayment().getAmount()));
                    accountRepos.save(account);
                    logger.info("Refunding deposit for account " + account.getAccountId());
                });
                paymentService.updatePayment(deposit.getPayment());
            }
        }
        auctionDTO.setStatus("FINISHED");
        for (AccountDTO account : winAccounts.keySet()) {
            orderServiceImpl.createOrder(account.getAccountId(), new HashSet<>(winAccounts.get(account)), auctionSessionId);
        }
        try {
            Optional<AuctionSession> optionalAuctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId());
            if (optionalAuctionSession.isEmpty()) {
                throw new ResourceNotFoundException("Auction session not found");
            }


            AuctionSession auctionSession = optionalAuctionSession.get();
            for (Item item : auctionSession.getAuctionItems().stream().map(AuctionItem::getItem).toList()) {
                auctionSession.getAuctionItems().stream()
                        .filter(auctionItem -> Objects.equals(auctionItem.getItem().getItemId(), item.getItemId()))
                        .findFirst().ifPresent(auctionItem -> {
                            if (bidService.getBidsByAuctionItemId(auctionItem.getAuctionItemId()).isEmpty()) {
                                item.setStatus(Item.Status.QUEUE);
                                itemRepos.save(item);
                            } else {
                                item.setStatus(Item.Status.UNSOLD);
                                itemRepos.save(item);
                            }
                        });
            }
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));

            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
        logger.info("Auction session " + auctionSessionId + " finished :" + getAuctionSessionById(auctionSessionId).getStatus());
    }

    @CacheEvict(value = "auctionSession", allEntries = true)
    @Override
    public void terminateAuction(int auctionSessionId) {
        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        if (auctionDTO.getStatus().equals("FINISHED") || auctionDTO.getStatus().equals("TERMINATED")) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        for (AuctionItemDTO auctionItem : auctionDTO.getAuctionItems()) {
            bidService.terminateAuctionItem(auctionItem.getId());
        }
        for (DepositDTO deposit : auctionDTO.getDeposits()) {
            deposit.getPayment().setStatus(Payment.Status.FAILED);
            accountRepos.findById(deposit.getPayment().getAccountId()).ifPresent(account -> {
                account.setBalance(account.getBalance().add(deposit.getPayment().getAmount()));
                accountRepos.save(account);
                logger.info("Refunding deposit for account " + account.getAccountId());
            });
            paymentService.updatePayment(deposit.getPayment());

        }
        auctionDTO.setStatus("TERMINATED");
        try {
            Optional<AuctionSession> optionalAuctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId());
            if (optionalAuctionSession.isEmpty()) {
                throw new ResourceNotFoundException("Auction session not found");
            }
            AuctionSession auctionSession = optionalAuctionSession.get();
            for (Item item : auctionSession.getAuctionItems().stream().map(AuctionItem::getItem).toList()) {
                auctionSession.getAuctionItems().stream()
                        .filter(auctionItem -> Objects.equals(auctionItem.getItem().getItemId(), item.getItemId()))
                        .findFirst().ifPresent(auctionItem -> {
                            item.setStatus(Item.Status.QUEUE);
                            itemRepos.save(item);
                        });
            }
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));

            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
    }

    @Override
    @CacheEvict(value = "auctionSession", allEntries = true)
    public void startAuction(int auctionSessionId) {
        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        logger.info("Starting auction session " + auctionSessionId);
        if (auctionDTO.getStatus().equals("PROGRESSING")) {
            logger.warn("Auction session " + auctionSessionId + " already started");
            return;
        }
        auctionDTO.setStatus("PROGRESSING");
        try {
            Optional<AuctionSession> optionalAuctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId());
            if (!optionalAuctionSession.isPresent()) {
                throw new ResourceNotFoundException("Auction session not found");
            }


            AuctionSession auctionSession = optionalAuctionSession.get();
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));

            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
        logger.info("Auction session " + auctionSessionId + " started");
    }

    @Override
    @Cacheable(key = "#pageable", value = "auctionSession")
    public Page<AuctionSessionDTO> getFeaturedAuctionSessions(Pageable pageable) {
        List<AuctionSession> auctionSessionList = auctionSessionRepos.findAll();

        BigDecimal evaluationThreshold = new BigDecimal(2);

        List<AuctionSessionDTO> featuredAuctionSessions = auctionSessionList.stream().filter(
                        auctionSession -> {
                            BigDecimal totalEvaluation = auctionSession.getAuctionItems().stream()
                                    .map(auctionItem -> auctionItem.getItem().getReservePrice())
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            return auctionSession.getStartDate().isAfter(LocalDateTime.now())
//                            && auctionSession.getStartDate().isBefore(LocalDateTime.now().plusDays(7))
                                    && !auctionSession.getAuctionItems().isEmpty()
                                    && !auctionSession.getDeposits().isEmpty()
                                    && totalEvaluation.compareTo(evaluationThreshold) >= 0;
                        }
                ).map(AuctionSessionDTO::new).
                collect(Collectors.toList());

        logger.info("Featured auction sessions: " + featuredAuctionSessions.size());
        // Provide a default value for pageable if it's null
        if (pageable == null) {
            pageable = PageRequest.of(0, 5);
        }
        return new PageImpl<>(featuredAuctionSessions, pageable, featuredAuctionSessions.size());
    }

    @Override
    @CacheEvict(key = "#auctionDTO.auctionSessionId", value = "auctionSession")
    public AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO) {
        if (auctionDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("Start date must be in the future");
        }
        if (auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())) {
            throw new InvalidInputException("End date must be after start date");
        }

        try {
            Optional<AuctionSession> optionalAuctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId());
            if (!optionalAuctionSession.isPresent()) {
                throw new ResourceNotFoundException("Auction session not found");
            }


            AuctionSession auctionSession = optionalAuctionSession.get();
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));
            auctionSessionRepos.save(auctionSession);
            return auctionDTO;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
    }

    @Cacheable(key = "#id", value = "auctionSession")
    @Override
    public AuctionSessionDTO getAuctionSessionById(int id) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(id).orElseThrow(() ->
                    new ResourceNotFoundException("Auction Session Id Not Found"));
            return new AuctionSessionDTO(auctionSession);
        } catch (Exception e) {
            logger.error("Error processing auction session id: " + id, e);
            throw new ResourceNotFoundException("Error processing auction session", e);
        }
    }


    @Cacheable(key = "'past'+#pageable != null ? #pageable : 'default'", value = "auctionSession")
    @Override
    public Page<AuctionSessionDTO> getAllAuctionSessions(Pageable pageable) {
        Page<AuctionSession> auctionSessions = auctionSessionRepos.findAll(pageable);
        if (auctionSessions.isEmpty()) {
            throw new ResourceNotFoundException("No auction sessions found");
        }
        return auctionSessions.map(AuctionSessionDTO::new);
    }

    @Cacheable(key = "'past'+#pageable != null ? #pageable : 'default'", value = "auctionSession")
    @Override
    public Page<AuctionSessionDTO> getPastAuctionSessions(Pageable pageable) {
        Page<AuctionSession> pastAuctionSessions = auctionSessionRepos.findByEndDateBefore(LocalDateTime.now(), pageable);
        if (pastAuctionSessions.isEmpty()) {
            logger.warn("No past auction sessions found");
            throw new ResourceNotFoundException("No past auction sessions found");
        }
        return pastAuctionSessions.map(AuctionSessionDTO::new);


    }

    @Override
    @Cacheable(key = "#pageable+#title", value = "auctionSession")
    public Page<AuctionSessionDTO> getAuctionSessionsByTitle(Pageable pageable, String title) {
        Page<AuctionSessionDTO> a = auctionSessionRepos.findByTitleContaining(title, pageable)
                .map(AuctionSessionDTO::new);
        if (a.isEmpty()) {
            logger.warn("No auction sessions with title:" + title + " found");
            throw new ResourceNotFoundException("No auction sessions with title:" + title + " found");
        }
        return a;
    }

    @Cacheable(key = "'upcoming'+#pageable != null ? #pageable : 'default'", value = "auctionSession")
    @Override
    public Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable) {
        Page<AuctionSession> upcomingAuctionSessions = auctionSessionRepos.findByStartDateAfter(LocalDateTime.now(), pageable);
        List<AuctionSession> listA = upcomingAuctionSessions.stream().filter(
                auctionSession -> auctionSession.getStatus().equals(AuctionSession.Status.SCHEDULED)
        ).toList();

        if (upcomingAuctionSessions.isEmpty()) {
            logger.warn("No upcoming auction sessions found");
            throw new ResourceNotFoundException("No upcoming auction sessions found");
        }
        return new PageImpl<>(listA.stream()
                .map(AuctionSessionDTO::new).toList());

    }


}

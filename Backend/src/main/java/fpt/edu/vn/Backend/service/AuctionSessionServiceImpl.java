package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.request.UpdateConsignmentStatusRequestDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateStatusAuctionSessionRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
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
    private final BidService bidService;
    private final PaymentService paymentService;
    private final AccountServiceImpl accountServiceImpl;
    private final ItemRepos itemRepos;
    private final AuctionItemRepos auctionItemRepos;
    private final OrderServiceImpl orderServiceImpl;

    @Autowired
    public AuctionSessionServiceImpl(AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos,
                                     DepositRepos depositRepos, PaymentRepos paymentRepos,
                                     BidService bidService, PaymentService paymentServiceImpl,
                                     AccountServiceImpl accountServiceImpl, ItemRepos itemRepos,
                                     AuctionItemRepos auctionItemRepos, OrderServiceImpl orderServiceImpl) {
        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
        this.depositRepos = depositRepos;
        this.paymentRepos = paymentRepos;
        this.bidService = bidService;
        this.paymentService = paymentServiceImpl;
        this.accountServiceImpl = accountServiceImpl;
        this.itemRepos = itemRepos;
        this.auctionItemRepos = auctionItemRepos;
        this.orderServiceImpl = orderServiceImpl;
    }

    @Override
    @CacheEvict(key = "#auctionSessionId",cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
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
                .multiply(BigDecimal.valueOf(4.5 / 100d));
        depositAmount = depositAmount.max(minPrice);
        depositAmount = depositAmount.min(maxPrice);
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
    @CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public boolean assignAuctionSession(AssignAuctionItemDTO assign) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(assign.getAuctionSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Auction Session not found: " + assign.getAuctionSessionId()));
            for (Integer itemIds : assign.getItem()) {
                Item item = itemRepos.findById(itemIds)
                        .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemIds));
                if (item.getStatus() != Item.Status.QUEUE && item.getStatus() != Item.Status.UNSOLD) {
                    throw new IllegalStateException("Item is not in queue or unsold: " + item.getItemId());
                }

                AuctionItem auctionItem = new AuctionItem();
                auctionItem.setAuctionItemId(new AuctionItemId(auctionSession.getAuctionSessionId(), item.getItemId()));
                auctionItem.setAuctionSession(auctionSession);
                auctionItem.setItem(item);
                auctionItem.setCurrentPrice(item.getReservePrice()); // Buy in price
                auctionItemRepos.save(auctionItem);

                item.setStatus(Item.Status.IN_AUCTION);
                itemRepos.save(item);
            }
            return true;
        } catch (Exception e) {
            logger.error("Error assigning auction session", e);
            return false;
        }
    }

    @CacheEvict(key = "#auctionDTO.getAuctionSessionId()",cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
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
            auctionSession.setStatus(AuctionSession.Status.SCHEDULED);
            AuctionSession savedAuctionSession = auctionSessionRepos.save(auctionSession);

            auctionDTO.setAuctionSessionId(savedAuctionSession.getAuctionSessionId());
            return auctionDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error creating auction session", e);
        }
    }

    @Override
    @CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public void finishAuction(int auctionSessionId) {
        record Winner(AccountDTO dto, List<AuctionItemId> items) {}

        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        if (auctionDTO.getStatus().equals("FINISHED") || auctionDTO.getStatus().equals("TERMINATED")) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }

        Map<Integer, Winner> winAccounts = new HashMap<>();
        logger.info("Finishing auction session " + auctionSessionId);

        for (AuctionItemDTO auctionItem : auctionDTO.getAuctionItems()) {
            bidService.finishAuctionItem(auctionItem.getId());
            AccountDTO account = accountServiceImpl.getAccountById(bidService.getHighestBid(auctionItem.getId())
                    .getPayment().getAccountId());
            if (account == null) {
                continue;
            }
            Winner winner = winAccounts.get(account.getAccountId());
            if (winner == null) {
                winner = new Winner(account, new ArrayList<>());
                winAccounts.put(account.getAccountId(), winner);
            }
            winner.items().add(auctionItem.getId());
        }

        winAccounts.forEach((account, winner) -> {
            logger.info("Winner: " + account + " won items: " + winner.items().stream()
                    .map(AuctionItemId::toString)
                    .collect(Collectors.joining(",")));
        });

        for (DepositDTO deposit : auctionDTO.getDeposits()) {
            if (deposit.getPayment().getStatus().equals(Payment.Status.SUCCESS)
                    || deposit.getPayment().getStatus().equals(Payment.Status.FAILED)) {
                continue;
            }
            if (winAccounts.containsKey(deposit.getPayment().getAccountId())) {
                deposit.getPayment().setStatus(Payment.Status.SUCCESS);
                paymentService.updatePayment(deposit.getPayment());
            } else {
                deposit.getPayment().setStatus(Payment.Status.FAILED);
                accountRepos.findById(deposit.getPayment().getAccountId()).ifPresent(account -> {
                    account.setBalance(account.getBalance().add(deposit.getPayment().getAmount()));
                    accountRepos.save(account);
                    logger.info("Refunded deposit id {} for account {}", deposit.getDepositId(), account.getAccountId());
                });
                paymentService.updatePayment(deposit.getPayment());
            }
        }

        for (Winner winner : winAccounts.values()) {
            orderServiceImpl.createOrder(winner.dto.getAccountId(), new HashSet<>(winner.items), auctionSessionId);
        }

        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId()).
                    orElseThrow(() -> new ResourceNotFoundException("Auction session not found", "id", auctionSessionId));
            for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
                Item item = auctionItem.getItem();
                if (bidService.getBidsByAuctionItemId(auctionItem.getAuctionItemId()).isEmpty()) {
                    item.setStatus(Item.Status.QUEUE);
                } else {
                    item.setStatus(Item.Status.UNSOLD);
                }
                itemRepos.save(item);
            }
            auctionSession.setStatus(AuctionSession.Status.FINISHED);
            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
        logger.info("Auction session " + auctionSessionId + " finished");
    }

    @CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    @Override
    public void terminateAuction(int auctionSessionId) {
        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        if (auctionDTO.getStatus().equals("FINISHED") || auctionDTO.getStatus().equals("TERMINATED")) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        logger.info("Terminating auction session " + auctionSessionId);
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
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId()).
                    orElseThrow(() -> new ResourceNotFoundException("Auction session not found", "id", auctionSessionId));
            for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
                Item item = auctionItem.getItem();
                item.setStatus(Item.Status.QUEUE);
                itemRepos.save(item);
            }
            auctionSession.setStatus(AuctionSession.Status.TERMINATED);
            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
    }

    @Override
    @CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public void startAuction(int auctionSessionId) {
        AuctionSessionDTO auctionDTO = getAuctionSessionById(auctionSessionId);
        if (auctionDTO.getStatus().equals("PROGRESSING")) {
            logger.warn("Auction session " + auctionSessionId + " already started");
            return;
        }
        logger.info("Starting auction session " + auctionSessionId);
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId()).
                    orElseThrow(() -> new ResourceNotFoundException("Auction session not found", "id", auctionSessionId));
            auctionSession.setStatus(AuctionSession.Status.PROGRESSING);
            auctionSessionRepos.save(auctionSession);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
        logger.info("Auction session " + auctionSessionId + " started");
    }

    @Override
    @Cacheable(key = "#pageable != null ? #pageable.toString() : 'default'", value = "auctionSession")
    public Page<AuctionSessionDTO> getFeaturedAuctionSessions(Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(0, 5);
        }
        List<AuctionSession> auctionSessionList = auctionSessionRepos.findByStartDateAfter(LocalDateTime.now());
        BigDecimal evaluationThreshold = new BigDecimal(2);
        List<AuctionSessionDTO> featuredAuctionSessions = auctionSessionList.stream().filter(
                        auctionSession -> {
                            BigDecimal totalEvaluation = auctionSession.getAuctionItems().stream()
                                    .map(auctionItem -> auctionItem.getItem().getReservePrice())
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            return auctionSession.getStatus() == AuctionSession.Status.SCHEDULED
                                    && !auctionSession.getAuctionItems().isEmpty()
                                    && !auctionSession.getDeposits().isEmpty()
                                    && totalEvaluation.compareTo(evaluationThreshold) >= 0;
                        }
                ).map(AuctionSessionDTO::new).
                collect(Collectors.toList());
        logger.info("Featured auction sessions: " + featuredAuctionSessions.size());
        return new PageImpl<>(featuredAuctionSessions, pageable, featuredAuctionSessions.size());
    }

    @Override
    @CacheEvict(key = "#auctionDTO.getAuctionSessionId()", cacheNames = "auctionSession",value = "auctionSession",allEntries = true)
    public AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO) {
        if (auctionDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("Start date must be in the future");
        }
        if (auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())) {
            throw new InvalidInputException("End date must be after start date");
        }
        if(auctionDTO.getStatus().equals("FINISHED") || auctionDTO.getStatus().equals("TERMINATED")){
            throw new InvalidInputException("Auction session already ended");
        }
        if(auctionDTO.getStatus().equals("PROGRESSING")){
            throw new InvalidInputException("Auction session already started");
        }
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId()).
                    orElseThrow(() -> new ResourceNotFoundException("Auction session not found", "id", auctionDTO.getAuctionSessionId()));
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setUpdateDate(LocalDateTime.now());
            // use terminate or finish button, thanks :D
            //auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));
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

    @Override
    public void updateAuctionSessionByStatus(UpdateStatusAuctionSessionRequestDTO request) {

            for (Integer auctionSessionId : request.getAuctionSessionId()) {
                try {
                    Optional<AuctionSession> auctionSession = auctionSessionRepos.findById(auctionSessionId);
                    AuctionSession auction = auctionSession.get();
                    if (auction != null) {
                        auction.setStatus(AuctionSession.Status.valueOf(request.getStatus().toUpperCase()));
                        auctionSessionRepos.save(auction);
                    } else {
                        throw new ResourceNotFoundException("Auction not found with ID: " + auctionSessionId);
                    }
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid status value: " + request.getStatus().toUpperCase());
                } catch (Exception e) {
                    throw new ConsignmentServiceException("An error occurred while updating auction with ID: " + auctionSessionId);
                }
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

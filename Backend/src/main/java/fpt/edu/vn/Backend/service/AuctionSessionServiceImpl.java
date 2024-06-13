package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
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
    public AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId) {
        Account a = accountRepos.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account not found:" + accountId));
        AuctionSession auctionSession = auctionSessionRepos.findById(auctionSessionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction session not found:" + auctionSessionId));
        List<Item> items = new ArrayList<>();
        for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
            items.add(auctionItem.getItem());
        }
        BigDecimal minPrice = new BigDecimal(100);
        BigDecimal maxPrice = new BigDecimal(1000);
        BigDecimal depositAmount = items.get(0).getReservePrice()
                .multiply(new BigDecimal(4.5))
                .divide(new BigDecimal(100));
        if (depositAmount.compareTo(minPrice) < 0) {
            depositAmount = minPrice;
        }
        if (depositAmount.compareTo(maxPrice) > 0) {
            depositAmount = maxPrice;
        }
        items.sort(Comparator.comparing(Item::getReservePrice));
        if (a.getBalance().compareTo(items.get(0).getReservePrice()) >= 0) {
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
    public String placePreBid(int auctionSessionId, int accountId, double amount) {
        return "";
    }

    @Override
    public AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO) {
        if(auctionDTO.getStartDate().isBefore(LocalDateTime.now())){
            throw new InvalidInputException("Start date must be in the future");
        }
        if(auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())){
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
    public void finishAuction(int auctionSessionId) {
        AuctionSessionDTO auctionSessionDTO = getAuctionSessionById(auctionSessionId);
        List<AccountDTO> accounts = new ArrayList<>();
        logger.info("Finishing auction session " + auctionSessionId);
        if (auctionSessionDTO.getStatus().equals("FINISHED")) {
            logger.warn("Auction session " + auctionSessionId + " already finished");
            return;
        }
        for(AuctionItemDTO auctionItem:auctionSessionDTO.getAuctionItems()){
            AccountDTO account = new AccountDTO();
            account=accountServiceImpl.getAccountById(bidService.getHighestBid(auctionItem.getId()).getPayment().getAccountId());
            for(BidDTO bid:bidService.finishAuctionItem(auctionItem.getId())){
                logger.info("Finishing bid " + bid.getBidId());
            }
            accounts.add(account);
        }
        for (DepositDTO deposit : auctionSessionDTO.getDeposits()) {

            if (accounts.stream().noneMatch(account -> account.getAccountId() == deposit.getPayment().getAccountId())) {
                deposit.getPayment().setStatus(Payment.Status.FAILED);
                paymentService.updatePayment(deposit.getPayment());


            }
        }
        auctionSessionDTO.setStatus("FINISHED");
        logger.info("Auction session " + auctionSessionId + " finished");
        updateAuctionSession(auctionSessionDTO);
    }

    @Override
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
    public Page<AuctionSessionDTO> getAllAuctionSessions(Pageable pageable) {
        Page<AuctionSession> auctionSessions = auctionSessionRepos.findAll(pageable);
        if (auctionSessions.isEmpty()) {
            throw new ResourceNotFoundException("No auction sessions found");
        }
        return auctionSessions.map(AuctionSessionDTO::new);
    }

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
    public Page<AuctionSessionDTO> getAuctionSessionsByTitle(Pageable pageable, String title) {
        Page<AuctionSessionDTO> a= auctionSessionRepos.findByTitleContaining(title, pageable)
                .map(AuctionSessionDTO::new);
        if (a.isEmpty()) {
            logger.warn("No auction sessions with title:"+title+" found");
            throw new ResourceNotFoundException("No auction sessions with title:"+title+" found");
        }
        return a;
    }

    @Override
    public Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable) {
            Page<AuctionSession> upcomingAuctionSessions = auctionSessionRepos.findByStartDateAfter(LocalDateTime.now(), pageable);
            if (upcomingAuctionSessions.isEmpty()) {
                logger.warn("No upcoming auction sessions found");
                throw new ResourceNotFoundException("No upcoming auction sessions found");
            }
            return upcomingAuctionSessions.map(AuctionSessionDTO::new);

    }
}

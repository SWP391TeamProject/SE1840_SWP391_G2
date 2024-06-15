package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AssignAuctionItemDTO;
import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.OptionalValueBinding;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuctionSessionServiceImpl implements AuctionSessionService {
    private final AuctionSessionRepos auctionSessionRepos;
    private static final Logger logger = LoggerFactory.getLogger(AuctionSessionServiceImpl.class);
    private final AccountRepos accountRepos;
    private final DepositRepos depositRepos;
    private final PaymentRepos paymentRepos;

    @Autowired
    private ItemRepos itemRepos;

    @Autowired
    private AuctionItemRepos auctionItemRepos;


    @Autowired
    public AuctionSessionServiceImpl(AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos, DepositRepos depositRepos, PaymentRepos paymentRepos) {
        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
        this.depositRepos = depositRepos;
        this.paymentRepos = paymentRepos;
    }


    @Override
    public AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId) {
        Account a=accountRepos.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account not found:"+accountId));
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
        if(depositAmount.compareTo(maxPrice)>0){
            depositAmount=maxPrice;
        }
        items.sort(Comparator.comparing(Item::getReservePrice));
        if(a.getBalance().compareTo(items.get(0).getReservePrice())>=0){
            a.setBalance(a.getBalance().subtract(depositAmount));
            accountRepos.save(a);
            Payment payment = new Payment();
            payment.setAccount(a);
            payment.setPaymentAmount(depositAmount);
            payment.setType(Payment.Type.AUCTION_DEPOSIT);
            payment.setStatus(Payment.Status.PENDING);
            payment.setCreateDate(LocalDateTime.now());
            payment=paymentRepos.save(payment);

            Deposit deposit = new Deposit();
            deposit.setAuctionSession(auctionSession);
            deposit.setPayment(payment);
            deposit=depositRepos.save(deposit);

            auctionSession.getDeposits().add(deposit);
            auctionSessionRepos.save(auctionSession);

            return new AuctionSessionDTO(auctionSession);
        }
        else{
            throw new ResourceNotFoundException("Account balance is not enough to register for auction session");
        }
    }

    @Override
    public String placePreBid(int auctionSessionId, int accountId, double amount) {
        return "";
    }

    @Override
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

    @Override
    public AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO) {
        try {
            AuctionSession auctionSession = new AuctionSession();
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
    public AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO) {
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
            throw new RuntimeException("Error updating auction session", e);
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
        try {
            Page<AuctionSession> pastAuctionSessions = auctionSessionRepos.findByEndDateBefore(LocalDateTime.now(), pageable);
            if (pastAuctionSessions.isEmpty()) {
                logger.warn("No past auction sessions found");
                throw new ResourceNotFoundException("No past auction sessions found");
            }
            return pastAuctionSessions.map(AuctionSessionDTO::new);
        } catch (Exception e) {
            logger.error("Error retrieving past auction sessions", e);
            throw new RuntimeException("Error retrieving past auction sessions", e);
        }

    }

    @Override
    public Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable) {
        try {
            Page<AuctionSession> upcomingAuctionSessions = auctionSessionRepos.findByStartDateAfter(LocalDateTime.now(), pageable);
            if (upcomingAuctionSessions.isEmpty()) {
                logger.warn("No upcoming auction sessions found");
                throw new ResourceNotFoundException("No upcoming auction sessions found");
            }
            return upcomingAuctionSessions.map(AuctionSessionDTO::new);
        } catch (Exception e) {
            logger.error("Error retrieving upcoming auction sessions", e);
            throw new RuntimeException("Error retrieving upcoming auction sessions", e);
        }
    }



}

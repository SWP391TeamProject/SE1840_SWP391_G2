package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BidRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.DepositRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class BidServiceImpl implements BidService {

    private static final Logger log = LoggerFactory.getLogger(BidServiceImpl.class);

    private DepositRepos depositRepos;
    private BidRepos bidRepos;
    private AuctionItemRepos auctionItemRepos;
    private AccountRepos accountRepos;

    @Autowired
    public BidServiceImpl(DepositRepos depositRepos, BidRepos bidRepos,
                          AuctionItemRepos auctionItemRepos, AccountRepos accountRepos) {
        this.depositRepos = depositRepos;
        this.bidRepos = bidRepos;
        this.auctionItemRepos = auctionItemRepos;
        this.accountRepos = accountRepos;
    }


    @Override
    public List<BidDTO> getAllBids() {
        return bidRepos.findAll().stream().map(BidDTO::new).toList();
    }

    @Override
    public List<AccountDTO> getParticipants(AuctionItemId auctionItemId) {
        return bidRepos.findAllParticipantsByAuctionItemId(auctionItemId).stream().map(AccountDTO::new).toList();
    }

    @Override
    public boolean hasBidsByAuctionItemId(AuctionItemId auctionItemId) {
        return bidRepos.existsByAuctionItem_AuctionItemId(auctionItemId);
    }

    @Override
    public List<BidDTO> getBidsByAuctionItemId(AuctionItemId auctionItemId) {
        try {
            return bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByAmountDesc(auctionItemId).stream().map(BidDTO::new).toList();
        }catch (Exception e){
            throw new ResourceNotFoundException("Invalid auction item id: " + auctionItemId);
        }
    }

    @Override
    public Page<BidDTO> getBidsByAccountId(int id, Pageable pageable) {
        try {
            return bidRepos.findByAccount_AccountId(id, pageable).map(BidDTO::new);
        }catch (Exception e){
            throw new ResourceNotFoundException("Invalid account id: " + id);
        }

    }

    @Override
    @Transactional
    public BidDTO createBid(BidDTO bid) {
        Account acc = accountRepos.findById(bid.getAccountId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid account id: " + bid.getAccountId())
        );
        AuctionItem auctionItem = auctionItemRepos.findById(bid.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + bid.getAuctionItemId())
        );
        boolean newParticipant = !bidRepos.existsByAuctionItem_AuctionItemIdAndAccount_AccountId(
                bid.getAuctionItemId(), bid.getAccountId());
        Bid newBid = new Bid();
        newBid.setBidId(bid.getBidId());
        newBid.setAuctionItem(auctionItem);
        newBid.setAmount(bid.getAmount());
        newBid.setStatus(bid.getStatus());
        newBid.setAccount(acc);
        newBid.setCreatedDate(bid.getCreatedDate());
        newBid = bidRepos.save(newBid);
        auctionItem.setBidCount(auctionItem.getBidCount() + 1);
        if (newParticipant) {
            auctionItem.setBidCount(auctionItem.getBidCount() + 1);
        }
        auctionItemRepos.save(auctionItem);
        return new BidDTO(newBid);
    }

    @Override
    public BidDTO getBidById(int id) {
        return new BidDTO(bidRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        ));
    }

    @Override
    public BidDTO getHighestBid(AuctionItemId auctionItemId) {
        Bid bid = bidRepos.findFirstByAuctionItem_AuctionItemIdOrderByAmountDesc(auctionItemId);
        return bid == null ? null : new BidDTO(bid);
    }

    @Override
    public List<BidResponse> toBidResponse(List<BidDTO> bids) {
        List<BidResponse> responses = new ArrayList<>();
        for (BidDTO bid : bids) {
            BidResponse response = new BidResponse();
            response.setBidId(bid.getBidId());
            response.setAuctionItemId(bid.getAuctionItemId());
            response.setAccount(new AccountDTO(accountRepos.findById(bid.getAccountId()).orElseThrow(
                    () -> new IllegalArgumentException("Invalid account id: " + bid.getAccountId())
            )));
            response.getAccount().setPassword(null);
            response.setPrice(bid.getAmount());
            responses.add(response);
        }
        return responses;
    }

    @Override
    public BidReplyDTO addUser(BidDTO bidDTO, int auctionSessionId, int itemId, Authentication authentication, SimpMessageHeaderAccessor headerAccessor) {
        AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
        Account persistedAccount = accountRepos.findByEmail(authentication.getName()).orElse(null);
        if (persistedAccount == null) {
            return new BidReplyDTO("You are not login yet", BidReplyDTO.Status.ERROR);
        }
        if (!depositRepos.hasDeposited(auctionSessionId, persistedAccount.getAccountId())) {
            return new BidReplyDTO("You have not registered to this auction yet", BidReplyDTO.Status.ERROR);
        }
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("user", persistedAccount);
        BidDTO highestBid = getHighestBid(auctionItemId);
        BigDecimal currentBid = highestBid == null ? auctionItemRepos.findById(auctionItemId)
                .orElseThrow().getItem().getReservePrice() : highestBid.getAmount();
        return new BidReplyDTO(persistedAccount.getNickname() + " join the auction", currentBid, BidReplyDTO.Status.JOIN);
    }

    @Override
    public List<BidDTO> getBidsByAuctionId(int auctionId) {
        try {
            return bidRepos.findAllByAuctionItem_AuctionSession_AuctionSessionId(auctionId).stream().map(BidDTO::new).toList();
        }catch (Exception e){
            throw new InvalidInputException("Invalid auction item id: " + auctionId);
        }
    }
}
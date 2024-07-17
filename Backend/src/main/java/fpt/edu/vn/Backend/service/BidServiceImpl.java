package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BidRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private static final Logger log = LoggerFactory.getLogger(BidServiceImpl.class);

    private BidRepos bidRepos;
    private AuctionItemRepos auctionItemRepos;
    private AccountRepos accountRepos;

    @Autowired
    public BidServiceImpl(BidRepos bidRepos, AuctionItemRepos auctionItemRepos, AccountRepos accountRepos) {
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
    public BidDTO createBid(BidDTO bid) {
        Bid newBid = new Bid();
        newBid.setBidId(bid.getBidId());
        AuctionItem auctionItem = auctionItemRepos.findById(bid.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + bid.getAuctionItemId())
        );
        newBid.setAuctionItem(auctionItem);
        newBid.setAmount(bid.getAmount());
        newBid.setStatus(bid.getStatus());
        newBid.setAccount(accountRepos.findById(bid.getAccountId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid account id: " + bid.getAccountId())
        ));
        newBid.setCreatedDate(bid.getCreatedDate());
        return new BidDTO(bidRepos.save(newBid));
    }

    @Override
    public BidDTO getBidById(int id) {
        return new BidDTO(bidRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        ));
    }

    @Override
    public BidDTO getHighestBid(AuctionItemId auctionItemId) {
        Bid bid = bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByAmountDesc(auctionItemId).get(0);
        return bid == null ? null : new BidDTO(bid);
    }

    @Override
    public List<BidResponse> toBidResponse(List<BidDTO> bids) {
        List<BidResponse> responses = new ArrayList<>();
        for (BidDTO bid : bids) {
            BidResponse response = new BidResponse();
            response.setBidId(bid.getBidId());
            response.setAccount(new AccountDTO(accountRepos.findById(bid.getAccountId()).orElseThrow(
                    () -> new IllegalArgumentException("Invalid account id: " + bid.getAccountId())
            )));
            response.getAccount().setPassword(null);
            response.setPrice(bid.getAmount());
            responses.add(response);
        }
        return responses;
    }

}
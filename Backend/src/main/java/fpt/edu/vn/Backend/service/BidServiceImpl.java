package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BidRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BidServiceImpl implements BidService {

    private static final Logger log = LoggerFactory.getLogger(BidServiceImpl.class);
    private final BidRepos bidRepos;

    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private PaymentRepos paymentRepos;


    @Autowired
    public BidServiceImpl(BidRepos auctionBidRepository) {
        this.bidRepos = auctionBidRepository;
    }

    @Override
    public List<BidDTO> getAllBids() {
        return
                bidRepos.findAll().stream().map(
                        BidDTO::new).toList();
    }

    @Override
    public Page<BidDTO> getBidsByAccountId(int id, Pageable pageable) {
        try {
            return bidRepos.findByPayment_Account_AccountId(id, pageable).map(BidDTO::new);
        }catch (Exception e){
            throw new ResourceNotFoundException("Invalid account id: " + id);
        }

    }

    @Override
    public BidDTO createBid(BidDTO bid) {
        Bid newBid = new Bid();
        newBid.setBidId(bid.getBidId());
        newBid.setAuctionItem(auctionItemRepos.findById(bid.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + bid.getAuctionItemId())
        ));
        newBid.setPayment(paymentRepos.findById(bid.getPayment().getId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid payment id: " + bid.getPayment())
        ));
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
        // This method requires a custom query to be implemented in the repository
        auctionItemRepos.findById(auctionItemId).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + auctionItemId)
        );
        List<Bid> bids = bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(auctionItemId);
        if(bids.isEmpty()) return null;
        return new BidDTO(bids.get(0));
    }

    @Override
    public void deleteBid(int id) {
        bidRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        );
        bidRepos.deleteById(id);
    }

}
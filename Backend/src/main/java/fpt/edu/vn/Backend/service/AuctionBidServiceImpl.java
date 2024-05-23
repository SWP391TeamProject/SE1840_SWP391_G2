package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AuctionBidRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AuctionBidServiceImpl implements AuctionBidService {

    private final AuctionBidRepos auctionBidRepository;

    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    public AuctionBidServiceImpl(AuctionBidRepos auctionBidRepository) {
        this.auctionBidRepository = auctionBidRepository;
    }

    @Override
    public List<BidDTO> getAllAuctionBids() {
        return
                auctionBidRepository.findAll().stream().map(
                        BidDTO::new).toList();
    }

    @Override
    public BidDTO createAuctionBid(BidDTO bid) {
        Bid newBid = new Bid();
        newBid.setPrice(bid.getPrice());
        newBid.setCreateDate(bid.getCreateDate());
        newBid.setAuctionItem(auctionItemRepos.findById(bid.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + bid.getAuctionItemId())
        ));
        newBid.setAccount(accountRepos.findById(bid.getAccountId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid account id: " + bid.getAccountId())
        ));
        auctionBidRepository.save(newBid);
        return new BidDTO(newBid);
    }

    @Override
    public BidDTO getAuctionBidById(int id) {
        return new BidDTO(auctionBidRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        ));
    }

    @Override
    public BidDTO getHighestAuctionBid(int auctionItemId) {
        // This method requires a custom query to be implemented in the repository
        Bid highestBid = auctionBidRepository.findAllBidByAuctionItemId(auctionItemId).get(0);
        if(highestBid == null) return new BidDTO(auctionItemId, new BigDecimal(0));
        return new BidDTO(highestBid);
    }

    @Override
    public void deleteAuctionBid(int id) {
        auctionBidRepository.deleteById(id);
    }

}
package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.repository.AuctionBidRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionBidServiceImpl implements AuctionBidService {

    private final AuctionBidRepos auctionBidRepository;

    @Autowired
    public AuctionBidServiceImpl(AuctionBidRepos auctionBidRepository) {
        this.auctionBidRepository = auctionBidRepository;
    }

    @Override
    public List<Bid> getAllAuctionBids() {
        return auctionBidRepository.findAll();
    }

    @Override
    public Bid createAuctionBid(Bid bid) {
        return auctionBidRepository.save(bid);
    }

    @Override
    public Bid getAuctionBidById(int id) {
        return auctionBidRepository.findById(id).orElse(null);
    }

    @Override
    public Bid getHighestAuctionBid(int auctionId) throws IndexOutOfBoundsException{
        // This method requires a custom query to be implemented in the repository
        return auctionBidRepository.findAllBidByAuctionItemId(auctionId).get(0);
    }

    @Override
    public void deleteAuctionBid(int id) {
        auctionBidRepository.deleteById(id);
    }

}
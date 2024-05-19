package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionBidDTO;
import fpt.edu.vn.Backend.pojo.AuctionBid;
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
    public List<AuctionBid> getAllAuctionBids() {
        return auctionBidRepository.findAll();
    }

    @Override
    public AuctionBid createAuctionBid(AuctionBid auctionBid) {
        return auctionBidRepository.save(auctionBid);
    }

    @Override
    public AuctionBid getAuctionBidById(int id) {
        return auctionBidRepository.findById(id).orElse(null);
    }

    @Override
    public AuctionBid getHighestAuctionBid(int auctionId) throws IndexOutOfBoundsException{
        // This method requires a custom query to be implemented in the repository
        return auctionBidRepository.findAllBidByAuctionItemId(auctionId).get(0);
    }

    @Override
    public void deleteAuctionBid(int id) {
        auctionBidRepository.deleteById(id);
    }

}
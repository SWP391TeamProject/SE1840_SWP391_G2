package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.pojo.Bid;

import java.util.List;

public interface AuctionBidService {
    List<BidDTO> getAllAuctionBids();
    BidDTO createAuctionBid(BidDTO bid);
    BidDTO getAuctionBidById(int id);
    BidDTO getHighestAuctionBid(int auctionId);
    void deleteAuctionBid(int id);
    }

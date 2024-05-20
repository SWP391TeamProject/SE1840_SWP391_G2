package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Bid;

import java.util.List;

public interface AuctionBidService {
    List<Bid> getAllAuctionBids();
    Bid createAuctionBid(Bid bid);
    Bid getAuctionBidById(int id);
    Bid getHighestAuctionBid(int auctionId);
    void deleteAuctionBid(int id);
    }

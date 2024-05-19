package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.AuctionBid;

import java.util.List;

public interface AuctionBidService {
    List<AuctionBid> getAllAuctionBids();
    AuctionBid createAuctionBid(AuctionBid auctionBid);
    AuctionBid getAuctionBidById(int id);
    AuctionBid getHighestAuctionBid(int auctionId);
    void deleteAuctionBid(int id);
    }

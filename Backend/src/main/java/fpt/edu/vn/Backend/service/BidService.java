package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;

import java.util.List;

public interface BidService {
    List<BidDTO> getAllBids();
    BidDTO createBid(BidDTO bid);
    BidDTO getBidById(int id);
    BidDTO getHighestBid(AuctionItemId auctionId);
    void deleteBid(int id);
    }

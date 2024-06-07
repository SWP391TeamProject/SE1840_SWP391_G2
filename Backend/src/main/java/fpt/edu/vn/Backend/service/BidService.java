package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface BidService {
    List<BidDTO> getAllBids();
    List<BidDTO> getBidsByAuctionItemId(AuctionItemId auctionItemId);
    Page<BidDTO> getBidsByAccountId(int id,Pageable pageable);
    BidDTO createBid(BidDTO bid);
    BidDTO getBidById(int id);
    BidDTO getHighestBid(AuctionItemId auctionId);
    void deleteBid(int id);
    List<BidResponse> toBidResponse(List<BidDTO> bids);
    }

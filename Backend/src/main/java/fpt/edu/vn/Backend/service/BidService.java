package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface BidService {
    List<BidDTO> getAllBids();
    List<AccountDTO> getParticipants(AuctionItemId auctionItemId);
    List<BidDTO> getBidsByAuctionItemId(AuctionItemId auctionItemId);
    boolean hasBidsByAuctionItemId(AuctionItemId auctionItemId);
    Page<BidDTO> getBidsByAccountId(int id,Pageable pageable);
    BidDTO createBid(BidDTO bid);
    BidDTO getBidById(int id);
    @Nullable BidDTO getHighestBid(AuctionItemId auctionId);
    List<BidResponse> toBidResponse(List<BidDTO> bids);
}

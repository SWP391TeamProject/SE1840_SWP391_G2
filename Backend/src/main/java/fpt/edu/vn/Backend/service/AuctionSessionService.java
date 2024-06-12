package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface AuctionSessionService {

    AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO);

    AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO);
    
    AuctionSessionDTO getAuctionSessionById(int id);

    Page<AuctionSessionDTO> getAllAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getPastAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getAuctionSessionsByTitle(Pageable pageable,String title);

    AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId);

    String placePreBid(int auctionSessionId, int accountId, double amount);

    void finishAuction(int auctionSessionId);

}

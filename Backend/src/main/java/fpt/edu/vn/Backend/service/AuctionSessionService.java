package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AssignAuctionItemDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateStatusAuctionSessionRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;


public interface AuctionSessionService {

    AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO);

    AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO);
    
    AuctionSessionDTO getAuctionSessionById(int id);

    void updateAuctionSessionByStatus(UpdateStatusAuctionSessionRequestDTO request);

    Page<AuctionSessionDTO> getAllAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getPastAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable);

    Page<AuctionSessionDTO> getAuctionSessionsByTitle(Pageable pageable,String title);

    AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId);

    boolean assignAuctionSession(AssignAuctionItemDTO assignAuctionItemDTO);

    void finishAuction(int auctionSessionId);

    void terminateAuction(int auctionSessionId);

    void startAuction(int auctionSessionId);

    Page<AuctionSessionDTO> getFeaturedAuctionSessions(Pageable pageable);


}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AssignAuctionItemDTO;
import fpt.edu.vn.Backend.DTO.AuctionCreateDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Set;


public interface AuctionSessionService {

    AuctionSessionDTO createAuctionSession(AuctionCreateDTO auctionDTO);

    AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO);

    AuctionSessionDTO getAuctionSessionById(int id, @Nullable Integer accountId);

    Page<AuctionSessionDTO> getAuctionSessions(Pageable pageable,
                                               @Nullable Set<AuctionSession.Status> status,
                                               @Nullable String search,
                                               @Nullable LocalDateTime fromDate,
                                               @Nullable LocalDateTime toDate,
                                               @Nullable Integer accountId);

    Page<AuctionSessionDTO> getFeaturedAuctionSessions(Pageable pageable, @Nullable Integer accountId);

    Page<AuctionSessionDTO> getPastAuctionOfItem(Pageable pageable, int itemId);

    AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId);

    boolean assignAuctionSession(AssignAuctionItemDTO assignAuctionItemDTO);

    void finishAuction(int auctionSessionId);

    void terminateAuction(int auctionSessionId);

    void startAuction(int auctionSessionId);
}

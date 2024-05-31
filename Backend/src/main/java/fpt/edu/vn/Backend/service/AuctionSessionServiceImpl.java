package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuctionSessionServiceImpl implements AuctionSessionService{
    private final AuctionSessionRepos auctionSessionRepos;
    private static final Logger logger = LoggerFactory.getLogger(AuctionSessionServiceImpl.class);
    @Autowired
    public AuctionSessionServiceImpl(AuctionSessionRepos auctionSessionRepos) {
        this.auctionSessionRepos = auctionSessionRepos;
    }


    @Override
    public AuctionSessionDTO createAuctionSession(AuctionSessionDTO auctionDTO) {
        try {
            AuctionSession auctionSession = new AuctionSession();
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));

            AuctionSession savedAuctionSession = auctionSessionRepos.save(auctionSession);

            auctionDTO.setAuctionSessionId(savedAuctionSession.getAuctionSessionId());
            return auctionDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error creating auction session", e);
        }
    }

    @Override
    public AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO) {
        try {
            Optional<AuctionSession> optionalAuctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId());
            if (!optionalAuctionSession.isPresent()) {
                throw new ResourceNotFoundException("Auction session not found");
            }

            AuctionSession auctionSession = optionalAuctionSession.get();
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(auctionDTO.getCreateDate());
            auctionSession.setUpdateDate(auctionDTO.getUpdateDate());
            auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));

            auctionSessionRepos.save(auctionSession);
            return auctionDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error updating auction session", e);
        }
    }

    @Override
    public AuctionSessionDTO getAuctionSessionById(int id) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(id).orElse(null);
            if(auctionSession != null){
               return new AuctionSessionDTO(auctionSession);
            }
            return null;
        }catch(Exception e){
            logger.error("Auction Session Id Not Found");
            throw new ResourceNotFoundException("Error processing ", e.getCause());
        }
    }

    @Override
    public Page<AuctionSessionDTO> getAllAuctionSessions(Pageable pageable) {
        Page<AuctionSession> auctionSessions = auctionSessionRepos.findAll(pageable);
        if (auctionSessions.isEmpty()) {
            throw new ResourceNotFoundException("No auction sessions found");
        }
        return auctionSessions.map(AuctionSessionDTO::new);
    }

    @Override
    public Page<AuctionSessionDTO> getPastAuctionSessions(Pageable pageable) {
        return null;
    }

    @Override
    public Page<AuctionSessionDTO> getUpcomingAuctionSessions(Pageable pageable) {
        return null;
    }
}

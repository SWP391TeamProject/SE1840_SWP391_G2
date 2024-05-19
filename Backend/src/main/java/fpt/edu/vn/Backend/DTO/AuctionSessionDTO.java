package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuctionSessionDTO {
    private int auctionSessionId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public AuctionSessionDTO(AuctionSession auctionSession) {
        this.auctionSessionId = auctionSession.getAuctionSessionId();
        this.startDate = auctionSession.getStartDate();
        this.endDate = auctionSession.getEndDate();
        this.status = auctionSession.getStatus();
        this.createDate = auctionSession.getCreateDate();
        this.updateDate = auctionSession.getUpdateDate();
    }

    // getters and setters
    // ...
}
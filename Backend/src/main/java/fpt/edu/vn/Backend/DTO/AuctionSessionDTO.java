package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuctionSessionDTO {
    private int auctionSessionId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public AuctionSessionDTO() {
    }
    public AuctionSessionDTO(AuctionSession auctionSession) {
        this.auctionSessionId = auctionSession.getAuctionSessionId();
        this.startDate = auctionSession.getStartDate();
        this.endDate = auctionSession.getEndDate();
        this.status = String.valueOf(auctionSession.getStatus());
        this.createDate = auctionSession.getCreateDate();
        this.updateDate = auctionSession.getUpdateDate();
    }

    public AuctionSessionDTO(int auctionSessionId, LocalDateTime startDate, LocalDateTime endDate, String status, LocalDateTime createDate, LocalDateTime updateDate) {
        this.auctionSessionId = auctionSessionId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    // getters and setters
    // ...
}
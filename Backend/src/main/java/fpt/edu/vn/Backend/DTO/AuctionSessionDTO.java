package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Deposit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuctionSessionDTO {
    private int auctionSessionId;
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private Set<AttachmentDTO> attachments;
    private Set<AuctionItemDTO> auctionItems;
    private Set<DepositDTO> deposits;

    public AuctionSessionDTO(AuctionSession auctionSession) {
        this.auctionSessionId = auctionSession.getAuctionSessionId();
        this.startDate = auctionSession.getStartDate();
        this.endDate = auctionSession.getEndDate();
        this.status = String.valueOf(auctionSession.getStatus());
        this.createDate = auctionSession.getCreateDate();
        this.updateDate = auctionSession.getUpdateDate();
        this.title = auctionSession.getTitle();
        this.attachments = auctionSession.getAttachments() != null ? auctionSession.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toSet()) : new HashSet<>();
        this.auctionItems = auctionSession.getAuctionItems() != null ? auctionSession.getAuctionItems().stream().map(AuctionItemDTO::new).collect(Collectors.toSet()) : new HashSet<>();
        this.deposits = auctionSession.getDeposits() != null ? auctionSession.getDeposits().stream().map(DepositDTO::new).collect(Collectors.toSet()) : new HashSet<>();
    }



    // getters and setters
    // ...
}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Deposit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuctionSessionDTO implements Serializable {
    private int auctionSessionId;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private AuctionSession.Status status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private Set<AttachmentDTO> attachments;
    private Set<AuctionItemDTO> auctionItems;
    private boolean hasDeposited;
    private int participantCount;

    public static AuctionSessionDTO minimal(AuctionSession auctionSession) {
        return AuctionSessionDTO.builder()
                .auctionSessionId(auctionSession.getAuctionSessionId())
                .title(auctionSession.getTitle())
                .description(auctionSession.getDescription())
                .startDate(auctionSession.getStartDate())
                .endDate(auctionSession.getEndDate())
                .status(auctionSession.getStatus())
                .participantCount(auctionSession.getParticipantCount())
                .build();
    }



    // getters and setters
    // ...
}
package fpt.edu.vn.Backend.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BidDTO {
    private int bidId;
    private BigDecimal price;
    private LocalDateTime createDate;
    private int auctionItemId; // Use int for the AuctionItem reference in DTO
    private int accountId; // Use int for the Account reference in DTO
}
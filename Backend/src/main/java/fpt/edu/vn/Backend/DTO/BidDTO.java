package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Bid;
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

    public BidDTO(Bid bid) {
        this.bidId = bid.getBidId();
        this.price = bid.getPrice();
        this.createDate = bid.getCreateDate();
        this.auctionItemId = bid.getAuctionItem().getAuctionItemId();
        this.accountId = bid.getAccount().getAccountId();
    }

    public BidDTO(int auctionItemId, BigDecimal i, int accountId) {
        this.auctionItemId = auctionItemId;
        this.price = i;
        this.accountId = accountId;
    }
    public BidDTO(int auctionItemId, BigDecimal i) {
        this.auctionItemId = auctionItemId;
        this.price = i;
    }
}
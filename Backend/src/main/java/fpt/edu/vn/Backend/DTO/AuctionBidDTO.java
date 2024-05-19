package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionBid;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionBidDTO {
    private int bidId;
    private int bidderId;
    private String bidType;
    private BigDecimal price;
    private LocalDateTime createDate;
    private int auctionItemId;

    // getters and setters


    public AuctionBidDTO(AuctionBid auctionBid) {
        this.bidId = auctionBid.getBidId();
        this.bidderId = auctionBid.getBidder().getUserId();
        this.bidType = String.valueOf(auctionBid.getBidType());
        this.price = auctionBid.getPrice();
        this.createDate = auctionBid.getCreateDate();
        this.auctionItemId = auctionBid.getAuctionItem().getAuctionItemId();
    }

    public AuctionBidDTO(BigDecimal price,int bidderId, int auctionItemId) {
        this.price = price;
        this.bidderId = bidderId;
        this.auctionItemId = auctionItemId;
    }
}
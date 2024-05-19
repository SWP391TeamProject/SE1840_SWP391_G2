package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionBid;
import fpt.edu.vn.Backend.pojo.AuctionBidKey;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionBidDTO {
    private AuctionBidKey bidId;
    private String bidType;
    private BigDecimal price;
    private LocalDateTime createDate;

    // getters and setters


    public AuctionBidDTO(AuctionBid auctionBid) {
        this.bidId =  auctionBid.getId();
        this.price = auctionBid.getPrice();
        this.createDate = auctionBid.getCreateDate();
    }

    public AuctionBidDTO(BigDecimal price, AuctionBidKey auctionBidKey) {
        this.price = price;
        this.bidId =  auctionBidKey;

    }
}
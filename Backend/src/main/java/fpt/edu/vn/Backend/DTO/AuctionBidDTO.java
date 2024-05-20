package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionBid;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionBidDTO {
    private int bidId;
    private BigDecimal price;

    private LocalDateTime createDate;

    // getters and setters


    public AuctionBidDTO(AuctionBid auctionBid) {
        this.bidId =  auctionBid.getAuctionBidId();
        this.price = auctionBid.getPrice();
        this.createDate = auctionBid.getCreateDate();
    }

}
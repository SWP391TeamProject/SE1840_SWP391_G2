package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Bid;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionBidDTO {
    private int bidId;
    private BigDecimal price;

    private LocalDateTime createDate;

    // getters and setters


    public AuctionBidDTO(Bid bid) {
        this.bidId =  bid.getBidId();
        this.price = bid.getPrice();
        this.createDate = bid.getCreateDate();
    }

}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class BidDTO implements Serializable {
    private int bidId;
    private AuctionItemId auctionItemId;
    private PaymentDTO payment;

    public BidDTO(Bid bid) {
        this.bidId = bid.getBidId();
        this.auctionItemId = bid.getAuctionItem().getAuctionItemId();
        this.payment = new PaymentDTO(bid.getPayment());
    }
}
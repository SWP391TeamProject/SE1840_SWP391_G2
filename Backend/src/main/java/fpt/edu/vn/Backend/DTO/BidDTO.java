package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.pojo.Payment;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@Data
public class BidDTO implements Serializable {
    private int bidId;
    private AuctionItemId auctionItemId;
    private PaymentDTO payment;

    public BidDTO(Bid bid) {
        this.bidId = bid.getBidId();
        this.auctionItemId = bid.getAuctionItem().getAuctionItemId();
        this.payment = new PaymentDTO();
        this.payment.setPaymentAmount(bid.getAmount());
        this.payment.setStatus(Payment.Status.valueOf(bid.getStatus().name()));
        this.payment.setCreateDate(bid.getCreatedDate());
        this.payment.setAccountId(bid.getAccount().getAccountId());
    }
}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.pojo.Payment;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class BidDTO implements Serializable {
    private int bidId;
    private AuctionItemId auctionItemId;
    private Bid.Status status;
    private BigDecimal amount;
    private LocalDateTime createdDate;
    private Integer accountId;

    public BidDTO(Bid bid) {
        this.bidId = bid.getBidId();
        this.auctionItemId = bid.getAuctionItem().getAuctionItemId();
        this.status = bid.getStatus();
        this.amount = bid.getAmount();
        this.createdDate = bid.getCreatedDate();
        this.accountId = bid.getAccount().getAccountId();
    }
}
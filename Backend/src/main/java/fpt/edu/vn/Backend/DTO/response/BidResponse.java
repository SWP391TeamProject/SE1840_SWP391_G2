package fpt.edu.vn.Backend.DTO.response;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BidResponse implements Serializable {
    private int bidId;
    private AccountDTO account;
    private AuctionItemId auctionItemId;
    private BigDecimal price;
    private LocalDateTime createDate;

    public BidResponse(int bidId, AccountDTO account, BigDecimal price,LocalDateTime createDate) {
        this.bidId = bidId;
        this.account = account;
        this.price = price;
        this.createDate = createDate;
        if(account != null){
            this.account.setPassword(null);
        }
    }


    public BidResponse() {

    }
}

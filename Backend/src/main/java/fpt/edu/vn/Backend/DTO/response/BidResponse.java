package fpt.edu.vn.Backend.DTO.response;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.pojo.Bid;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class BidResponse implements Serializable {
    private int bidId;
    private AccountDTO account;
    private BigDecimal price;

    public BidResponse(int bidId, AccountDTO account, BigDecimal price) {
        this.bidId = bidId;
        this.account = account;
        this.price = price;
        if(account != null){
            this.account.setPassword(null);
        }
    }


    public BidResponse() {

    }
}

package fpt.edu.vn.Backend.DTO.response;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.pojo.Bid;
import lombok.Data;

@Data
public class BidResponse {
    private int bidId;
    private AccountDTO account;
    private double price;

    public BidResponse(int bidId, AccountDTO account, double price) {
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

package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.pojo.Deposit;
import lombok.*;

@NoArgsConstructor
@Data
public class DepositDTO {
    private int depositId;
    private AuctionItemId auctionItemId;
    private PaymentDTO payment;

    public DepositDTO(Deposit deposit) {
        this.depositId = deposit.getDepositId();
        this.auctionItemId = deposit.getAuctionItem().getAuctionItemId();
        this.payment = new PaymentDTO(deposit.getPayment());
    }

}

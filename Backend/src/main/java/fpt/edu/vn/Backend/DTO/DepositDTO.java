package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Deposit;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@Data
public class DepositDTO implements Serializable {
    private int depositId;
    private int auctionSessionId;
    private PaymentDTO payment;

    public DepositDTO(Deposit deposit) {
        this.depositId = deposit.getDepositId();
        this.auctionSessionId = deposit.getAuctionSession().getAuctionSessionId();
        this.payment = new PaymentDTO(deposit.getPayment());
    }

}

package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Deposit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositDTO {
    private int depositId;

    private int depositAmount;
    private String depositDate;

    private AccountDTO account;


//    private PaymentDTO payment;

    public DepositDTO(Deposit deposit) {
        this.depositId = deposit.getDepositId();
        this.depositAmount = deposit.getDepositAmount();
        this.depositDate = deposit.getDepositDate();
        this.account = new AccountDTO(deposit.getAccount());
//        this.payment = new PaymentDTO(deposit.getPayment());
    }
}

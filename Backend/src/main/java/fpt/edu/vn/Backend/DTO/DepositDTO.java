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
    private PaymentDTO payment;

    public DepositDTO(Deposit deposit) {
        this.depositId = deposit.getDepositId();
        this.depositAmount = deposit.getDepositAmount();
        this.depositDate = deposit.getDepositDate() != null ? deposit.getDepositDate() : "default_date"; // Provide a default date if needed
        this.account = deposit.getAccount() != null ? new AccountDTO(deposit.getAccount()) : null; // Handle potential null account
        this.payment = null; // Initialize payment with null to break the circular dependency
    }

    public void setPayment(PaymentDTO payment) {
        this.payment = payment;
    }

}

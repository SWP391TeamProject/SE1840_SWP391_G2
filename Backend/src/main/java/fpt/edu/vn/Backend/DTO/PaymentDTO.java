package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Builder
public class PaymentDTO implements Serializable {
    private int id;
    private BigDecimal paymentAmount;
    private LocalDateTime createDate;
    private Payment.Type type;
    private Payment.Status status;
    private Payment.Method method;
    private String failedReason;
    private int accountId;
    private Integer consignmentRewardItemId;
    private Integer depositAuctionId;

    public PaymentDTO(Payment payment) {
        if (payment == null) return;
        this.id = payment.getPaymentId();
        this.paymentAmount = payment.getPaymentAmount();
        this.createDate = payment.getCreateDate();
        this.type = payment.getType();
        this.status = payment.getStatus();
        this.method = payment.getMethod();
        this.failedReason = payment.getFailedReason();
        this.accountId = payment.getAccount().getAccountId();
        if (type == Payment.Type.CONSIGNMENT_REWARD)
            this.consignmentRewardItemId = payment.getConsignmentRewardItem().getItemId();
        if (type == Payment.Type.AUCTION_DEPOSIT)
            this.depositAuctionId = payment.getDeposit().getAuctionSession().getAuctionSessionId();
    }
}
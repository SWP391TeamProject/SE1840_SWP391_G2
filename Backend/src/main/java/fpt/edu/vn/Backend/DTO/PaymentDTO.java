package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;

import java.math.BigDecimal;

public class PaymentDTO {

    private int paymentId;

    private BigDecimal paymentAmount;

    private String paymentDate;

    private DepositDTO deposit;

    public PaymentDTO(Payment payment) {
        this.paymentId = payment.getPaymentId();
        this.paymentAmount = payment.getPaymentAmount();
        this.paymentDate = payment.getPaymentDate();
        this.deposit = new DepositDTO(payment.getDeposit());
    }

}

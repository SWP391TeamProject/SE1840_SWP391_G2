package fpt.edu.vn.Backend.DTO.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentSummaryDTO {
    private BigDecimal inboundFund;
    private BigDecimal outgoingFund;
    private BigDecimal frozenMoney;
    private BigDecimal walletDeposit;
    private BigDecimal walletWithdrawal;
}
package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.*;
import fpt.edu.vn.Backend.pojo.Payment;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentService {

    String createPayment(PaymentRequest paymentRequest) throws UnsupportedEncodingException;

    PaymentDTO getPaymentById(int id);

    Page<PaymentDTO> getAllPayment(Pageable pageable,
                                   @Nullable Payment.Type type, @Nullable Payment.Status status,
                                   @Nullable LocalDateTime fromDate, @Nullable LocalDateTime toDate,
                                   @Nullable Integer accountId,
                                   @Nullable String keyword);

    PaymentDTO createPayment(PaymentDTO paymentDTO);

    PaymentDTO updatePayment(PaymentDTO paymentDTO);

    void updatePaymentByStatus(UpdatePaymentStatusRequestDTO request);

    String createVNPayPayment(VnPayPaymentRequestDTO paymentRequest, String vnp_IpAddr) throws UnsupportedEncodingException;

    String capturePayment(PaymentCaptureRequestDTO dto);

    BigDecimal getInboundFund(Integer accountId, LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal getOutgoingFund(Integer accountId, LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal getFrozenMoney(Integer accountId, LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal getWalletDeposit(Integer accountId, LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal getWalletWithdrawal(Integer accountId, LocalDateTime startDate, LocalDateTime endDate);

}

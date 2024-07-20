package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.*;
import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {

    String createPayment(PaymentRequest paymentRequest) throws UnsupportedEncodingException;

    PaymentDTO getPaymentById(int id);

    Page<PaymentDTO> getAllPayment(Pageable pageable, Payment.Type type, Payment.Status status,String keyword);

    PaymentDTO createPayment(PaymentDTO paymentDTO);

    PaymentDTO updatePayment(PaymentDTO paymentDTO);

    void updatePaymentByStatus(UpdatePaymentStatusRequestDTO request);

    String createVNPayPayment(VnPayPaymentRequestDTO paymentRequest, String vnp_IpAddr) throws UnsupportedEncodingException;

    List<PaymentDTO> getUserPayments(String email);

    String capturePayment(PaymentCaptureRequestDTO dto);
    Page<Payment> searchPayment(String keyword,Pageable pageable);

}

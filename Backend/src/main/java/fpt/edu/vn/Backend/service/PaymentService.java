package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.DTO.request.VnPayPaymentRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.UnsupportedEncodingException;

public interface PaymentService {

    String createPayment(PaymentRequest paymentRequest);
    PaymentDTO updatePayment(PaymentRequest paymentRequest);
    PaymentDTO getPaymentById(int id);
    Page<PaymentDTO> getAllPayment(Pageable pageable);
    PaymentDTO deleteById(int id);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO updatePayment(PaymentDTO paymentDTO);

    String createVNPayPayment(VnPayPaymentRequestDTO paymentRequest,String vnp_IpAddr) throws UnsupportedEncodingException;


    PaymentDTO vnPayPaymentResponse(String token);

}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {

    PaymentDTO createPayment(PaymentRequest paymentRequest);
    PaymentDTO updatePayment(PaymentRequest paymentRequest);
    PaymentDTO getPaymentById(int id);
    Page<PaymentDTO> getAllPayment(Pageable pageable);
    PaymentDTO deleteById(int id);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO updatePayment(PaymentDTO paymentDTO);

}

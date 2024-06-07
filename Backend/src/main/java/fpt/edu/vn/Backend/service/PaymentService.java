package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;

public interface PaymentService {
    PaymentDTO getPaymentById(int id);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO updatePayment(PaymentDTO paymentDTO);

}

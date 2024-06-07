package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService{
    @Autowired
    private PaymentRepos paymentRepos;
    @Autowired
    private AccountRepos accountRepos;
    @Override
    public PaymentDTO getPaymentById(int id) {
        return new PaymentDTO(paymentRepos.findById(id).get());
    }

    @Override
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setPaymentAmount(paymentDTO.getAmount());
        payment.setCreateDate(LocalDateTime.now());
        payment.setType(paymentDTO.getType());
        payment.setStatus(paymentDTO.getStatus());
        payment.setAccount(accountRepos.findById(paymentDTO.getAccountId()).get());
        return new PaymentDTO(paymentRepos.save(payment));
    }

    @Override
    public PaymentDTO updatePayment(PaymentDTO paymentDTO) {
        return null;
    }
}

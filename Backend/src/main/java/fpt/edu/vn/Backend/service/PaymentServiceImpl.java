package fpt.edu.vn.Backend.service;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;




import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService{

    @Autowired
    private PaymentRepos paymentRepos;

    @Autowired
    private AccountRepos accountRepos;

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

}
//     @Override
//     public PaymentDTO createPayment(PaymentRequest paymentRequest) {
//         try {
//             Payment payment = new Payment();
//             payment.setPaymentAmount(paymentRequest.getAmount());
//             payment.setType(paymentRequest.getType());
//             payment.setStatus(paymentRequest.getStatus());
//             payment.setCreateDate(paymentRequest.getLocalDateTimeWithCurrentTime());
//             // Find the account and handle if it's not found
//             Account account = accountRepos.findById(paymentRequest.getAccountId())
//                     .orElseThrow(() -> new RuntimeException("Account not found"));
//             payment.setAccount(account);

//             // Save the payment
//             Payment savedPayment = paymentRepos.save(payment);

//             // Return the saved payment as a DTO
//             return new PaymentDTO(savedPayment);
//         } catch (Exception e) {
//             // Handle exceptions appropriately
//             // Log the exception (using a logging framework is recommended)
//             System.err.println("An error occurred while creating payment: " + e.getMessage());
//             throw new RuntimeException("Failed to create payment", e);
//         }
//     }

    @Override
    public PaymentDTO updatePayment(PaymentRequest paymentRequest) {
        try {
            // Find the payment by ID and handle if it's not found
            Payment payment = paymentRepos.findById(paymentRequest.getPaymentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + paymentRequest.getPaymentId()));

            // Update payment fields
            payment.setPaymentAmount(paymentRequest.getAmount());
            payment.setType(paymentRequest.getType());
            payment.setStatus(paymentRequest.getStatus());

            // Find the account by ID and handle if it's not found
            Account account = accountRepos.findById(paymentRequest.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + paymentRequest.getAccountId()));
            payment.setAccount(account);

            // Save the updated payment
            Payment updatedPayment = paymentRepos.save(payment);

            // Return the updated payment as a DTO
            return new PaymentDTO(updatedPayment);
        } catch (Exception e) {
            // Log the exception (using a logging framework is recommended)
            System.err.println("An error occurred while updating payment: " + e.getMessage());

            // Throw a custom exception or rethrow the caught exception
            throw new ResourceNotFoundException("Failed to update payment", e);
        }
    }

    @Override
    public PaymentDTO getPaymentById(int id) {
        try {
            Payment payment = paymentRepos.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
            return new PaymentDTO(payment);
        } catch (Exception e) {
            // Log the exception
            System.err.println("An error occurred while fetching payment: " + e.getMessage());
            // Throw a custom exception
            throw new ResourceNotFoundException("Failed to get payment by id", e);
        }
    }

    @Override
    public Page<PaymentDTO> getAllPayment(Pageable pageable) {
        try {
            Page<Payment> payments = paymentRepos.findAll(pageable);
            return payments.map(PaymentDTO::new);
        } catch (Exception e) {
            // Log the exception
            System.err.println("An error occurred while fetching all payments: " + e.getMessage());
            // Throw a custom exception
            throw new ResourceNotFoundException("Failed to get all payments", e);
        }
    }

    @Override
    public PaymentDTO deleteById(int id) {
        try {
            Payment payment = paymentRepos.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
            paymentRepos.deleteById(id);
            return new PaymentDTO(payment);
        } catch (Exception e) {
            // Log the exception
            System.err.println("An error occurred while deleting payment: " + e.getMessage());
            // Throw a custom exception
            throw new ResourceNotFoundException("Failed to delete payment by id", e);
        }
    }

}




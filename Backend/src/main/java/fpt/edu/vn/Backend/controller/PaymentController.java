package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.service.PaymentServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentServiceImpl paymentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(@PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayment(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(Principal principal, @PathVariable int id) {
        try {
            PaymentDTO paymentDTO = paymentService.getPaymentById(id);
            Authorizer.expectAdminOrUserId(principal, paymentDTO.getAccountId());
            return ResponseEntity.ok(paymentDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(Principal principal, @RequestBody PaymentRequest paymentRequest, HttpServletRequest request) {
        try {
            Authorizer.expectAdminOrUserId(principal, paymentRequest.getAccountId());
            paymentRequest.setIpAddr(request.getRemoteAddr());
            String createdPayment = paymentService.createPayment(paymentRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

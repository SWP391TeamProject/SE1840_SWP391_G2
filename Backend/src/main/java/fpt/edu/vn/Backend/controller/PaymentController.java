package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.DTO.request.VnPayPaymentRequestDTO;
import fpt.edu.vn.Backend.config.VnPayConfig;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.service.PaymentServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentServiceImpl paymentService;

    @GetMapping
    public Page<PaymentDTO> getAllPayments(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        return paymentService.getAllPayment(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable int id) {
        try {
            PaymentDTO paymentDTO = paymentService.getPaymentById(id);
            return ResponseEntity.ok(paymentDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentRequest paymentRequest,HttpServletRequest request) {
        try {
            paymentRequest.setIpAddr(request.getRemoteAddr());
            String createdPayment = paymentService.createPayment(paymentRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            // Set the ID in the DTO to ensure it's updated correctly
            PaymentDTO updatedPayment = paymentService.updatePayment(paymentRequest);
            return ResponseEntity.ok(updatedPayment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @PostMapping("/delete/{id}")
    public ResponseEntity<PaymentDTO> deletePayment(@PathVariable int id) {
        try {
            PaymentDTO deletedPayment = paymentService.deleteById(id);
            return ResponseEntity.ok(deletedPayment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @PostMapping("/create-vnpay-payment")
    public ResponseEntity<String> createVNPayPayment(@RequestBody VnPayPaymentRequestDTO paymentRequest, HttpServletRequest request) {
        try {
            String vnpayPayment = paymentService.createVNPayPayment(paymentRequest,request.getRemoteAddr());
            return ResponseEntity.ok(vnpayPayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/vnpay_ipn")
    public int orderReturn(HttpServletRequest request){
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode(params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VnPayConfig.hashAllFields(fields);
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
        String[] parts = vnp_OrderInfo.split("-");
        String orderType = parts[0]; // "DEPOSIT"
        String orderId = parts[1];
        PaymentDTO paymentDTO;
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                log.info("Payment success");
                switch (orderType) {
                    case "DEPOSIT":
                        // Deposit money to user account
                        log.info("here is the paymentID "+orderId);
                        updatePayment(new PaymentRequest().builder()
                                .paymentId(Integer.parseInt(orderId))

                                .status(Payment.Status.SUCCESS)
                                .build());
                        return 1;
                    case "PAYMENT":
                        // Pay for order
                        log.info("Pay for order");
                        break;
                    default:
                        break;
                }
                return 1;
            } else {
                log.info("Payment failed");
                updatePayment(new PaymentRequest().builder()
                        .paymentId(Integer.parseInt(orderId))
                        .status(Payment.Status.FAILED)
                        .build());
                return 0;
            }
        } else {
            log.info("FAILED: Invalid signature");
            return -1;
        }
    }

}

package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentCaptureRequestDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.DTO.request.UpdatePaymentStatusRequestDTO;
import fpt.edu.vn.Backend.config.VnPayConfig;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(
            @PageableDefault(size = 50) Pageable pageable,
            @RequestParam(required = false) Payment.Type type,
            @RequestParam(required = false) Payment.Status status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(paymentService.getAllPayment(pageable, type, status,search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(Principal principal, @PathVariable int id) {
        try {
            PaymentDTO paymentDTO = paymentService.getPaymentById(id);
            Authorizer.expectManagerOrUserId(principal, paymentDTO.getAccountId());
            return ResponseEntity.ok(paymentDTO);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<PaymentDTO> producePayment(@RequestBody PaymentDTO paymentRequest) {
        PaymentDTO createdPayment = paymentService.createPayment(paymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(Principal principal, @RequestBody PaymentRequest paymentRequest, HttpServletRequest request) throws UnsupportedEncodingException {
        Authorizer.expectManagerOrUserId(principal, paymentRequest.getAccountId());
        paymentRequest.setIpAddr(request.getRemoteAddr());
        String createdPayment = paymentService.createPayment(paymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }

    @PostMapping("/capture")
    public ResponseEntity<String> capturePayment(@RequestBody PaymentCaptureRequestDTO dto) {
        String res = paymentService.capturePayment(dto);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentDTO>> getPaymentHistory(Principal principal) {
        return ResponseEntity.ok(paymentService.getUserPayments(principal.getName() ));
    }

    @GetMapping("/vnpay_ipn")
    public int orderReturn(HttpServletRequest request){
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            fieldName = URLEncoder.encode(params.nextElement(), StandardCharsets.US_ASCII);
            fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII);
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
        String paymentId = request.getParameter("vnp_TxnRef");

        PaymentDTO paymentDTO;
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                log.info("Payment success");

                paymentService.updatePayment(PaymentRequest.builder()
                        .paymentId(Integer.parseInt(paymentId))
                        .status(Payment.Status.SUCCESS)
                        .build());
                return 1;
            } else {
                paymentService.updatePayment(PaymentRequest.builder()
                        .paymentId(Integer.parseInt(paymentId))
                        .status(Payment.Status.FAILED)
                        .build());
                return 0;
            }
        } else {
            log.info("FAILED: Invalid signature");
            return -1;
        }
    }
    @PostMapping("/updateStatus")
    public ResponseEntity<Void> updatePaymentStatus(@RequestBody(required = false) UpdatePaymentStatusRequestDTO paymentDTOList) {
        paymentService.updatePaymentByStatus(paymentDTOList);
        return ResponseEntity.ok().build();
    }
}

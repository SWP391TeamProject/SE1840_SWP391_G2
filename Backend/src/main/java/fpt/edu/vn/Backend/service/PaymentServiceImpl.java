package fpt.edu.vn.Backend.service;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.BillingDTO;
import fpt.edu.vn.Backend.DTO.request.InvoiceDTO;
import fpt.edu.vn.Backend.DTO.request.PaymentRequest;
import fpt.edu.vn.Backend.DTO.request.VnPayPaymentRequestDTO;
import fpt.edu.vn.Backend.config.VnPayConfig;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepos paymentRepos;

    @Autowired
    private AccountRepos accountRepos;

    @Override
    public String createPayment(PaymentRequest paymentRequest) {
        try {
            Payment payment = new Payment();
            payment.setPaymentAmount(paymentRequest.getAmount());
            payment.setType(paymentRequest.getType());
            payment.setStatus(Payment.Status.PENDING);
            // Find the account and handle if it's not found
            Account account = accountRepos.findById(paymentRequest.getAccountId())
                    .orElseThrow(() -> new InvalidInputException("Account not found"));
            payment.setAccount(account);

            // Save the payment
            Payment savedPayment = paymentRepos.save(payment);
            VnPayPaymentRequestDTO vnPayPaymentRequestDTO = new VnPayPaymentRequestDTO().builder()
                    .accountId(savedPayment.getAccount().getAccountId())
                    .vnp_Amount(savedPayment.getPaymentAmount())
                    .vnp_OrderInfo(paymentRequest.getOrderInfoType() + "-" + savedPayment.getPaymentId())
                    .build();
            // Return the saved payment as a DTO
            return createVNPayPayment(vnPayPaymentRequestDTO, paymentRequest.getIpAddr());
        } catch (Exception e) {
            System.err.println("An error occurred while creating payment: " + e.getMessage());
            throw new InvalidInputException("Failed to create payment", e);
        }
    }

    @Override
    public PaymentDTO updatePayment(PaymentRequest paymentRequest) {
        try {
            // Find the payment by ID and handle if it's not found
            Payment payment = paymentRepos.findById(paymentRequest.getPaymentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + paymentRequest.getPaymentId()));

            // Update payment field
            // Find the account by ID and handle if it's not found
            Account account = accountRepos.findById(payment.getAccount().getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + paymentRequest.getAccountId()));
            payment.setAccount(account);
            if (payment.getStatus().equals(Payment.Status.PENDING)) {
                payment.setStatus(paymentRequest.getStatus());
                if (paymentRequest.getStatus().equals(Payment.Status.SUCCESS)) {
                    payment.getAccount().setBalance(account.getBalance().add(payment.getPaymentAmount()));
                }
            }

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
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setPaymentAmount(paymentDTO.getAmount());
        payment.setCreateDate(LocalDateTime.now());
        payment.setType(paymentDTO.getType());
        payment.setStatus(paymentDTO.getStatus());
        payment.setAccount(accountRepos.findById(paymentDTO.getAccountId()).get());
        Payment savedPayment = paymentRepos.save(payment);
        return new PaymentDTO(savedPayment);
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
    public PaymentDTO updatePayment(PaymentDTO paymentDTO) {
        return null;
    }

    @Override
    public String createVNPayPayment(VnPayPaymentRequestDTO paymentRequest, String vnp_IpAddr) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
//        String vnp_IpAddr = VnPayConfig.getIpAddress(req);

        BigDecimal amount = paymentRequest.getVnp_Amount().multiply(BigDecimal.valueOf(100));
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

//        if (VnPayConfig.getVnp_BankCode() != null ) {
//            vnp_Params.put("vnp_BankCode", String.valueOf(paymentRequest.getVnp_BankCode()));
//        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", paymentRequest.getVnp_OrderInfo());
        vnp_Params.put("vnp_OrderType", !paymentRequest.getVnp_OrderInfo().equals("DEPOSIT") ? "200000" : "Other");

        if (VnPayConfig.vnp_Locale != null && !VnPayConfig.vnp_Locale.isEmpty()) {
            vnp_Params.put("vnp_Locale", VnPayConfig.vnp_Locale);
        }

        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        Account account = accountRepos.findById(5)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + 1));
        BillingDTO billing = new BillingDTO().builder()
                .vnp_Bill_Address("123")
                .vnp_Bill_City("Hanoi")
                .vnp_Bill_Country("Vietnam")
                .vnp_Bill_Email(account.getEmail())
                .vnp_Bill_FullName(account.getNickname())
                .vnp_Bill_Mobile("0123456789")
                .vnp_Bill_State("Hanoi")
                .build();

        //Billing
        vnp_Params.put("vnp_Bill_Mobile", billing.getVnp_Bill_Mobile());
        vnp_Params.put("vnp_Bill_Email", billing.getVnp_Bill_Email());

        if (billing.getVnp_Bill_FullName() != null && !billing.getVnp_Bill_FullName().isEmpty()) {
            int idx = billing.getVnp_Bill_FullName().indexOf(' ');
            String firstName = billing.getVnp_Bill_FullName().substring(0, idx);
            String lastName = billing.getVnp_Bill_FullName().substring(billing.getVnp_Bill_FullName().lastIndexOf(' ') + 1);
            vnp_Params.put("vnp_Bill_FirstName", firstName);
            vnp_Params.put("vnp_Bill_LastName", lastName);
        }

        InvoiceDTO invoice = new InvoiceDTO().builder()
                .vnp_Inv_Address("123")
                .vnp_Inv_Company("FPT")
                .vnp_Inv_Customer("FPT")
                .vnp_Inv_Email(account.getEmail())
                .vnp_Inv_Taxcode("123456")
                .vnp_Inv_Type("1")
                .build();

        vnp_Params.put("vnp_Bill_Address", invoice.getVnp_Inv_Address());
        vnp_Params.put("vnp_Bill_City", invoice.getVnp_Inv_Address());
        vnp_Params.put("vnp_Bill_Country", "Vietnam");

        if (billing.getVnp_Bill_State() != null && !billing.getVnp_Bill_State().isEmpty()) {
            vnp_Params.put("vnp_Bill_State", billing.getVnp_Bill_State());
        }

        // Invoice
        vnp_Params.put("vnp_Inv_Phone", invoice.getVnp_Inv_Phone());
        vnp_Params.put("vnp_Inv_Email", invoice.getVnp_Inv_Email());
        vnp_Params.put("vnp_Inv_Customer", invoice.getVnp_Inv_Customer());
        vnp_Params.put("vnp_Inv_Address", invoice.getVnp_Inv_Address());
        vnp_Params.put("vnp_Inv_Company", invoice.getVnp_Inv_Company());
        vnp_Params.put("vnp_Inv_Taxcode", invoice.getVnp_Inv_Taxcode());
        vnp_Params.put("vnp_Inv_Type", invoice.getVnp_Inv_Type());

        //Build data to hash and querystring
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (fieldNames.indexOf(fieldName) != fieldNames.size() - 1) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }

    @Override
    public PaymentDTO vnPayPaymentResponse(String token) {
        return null;
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




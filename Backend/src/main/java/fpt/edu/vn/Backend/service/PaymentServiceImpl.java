package fpt.edu.vn.Backend.service;


import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.request.*;
import fpt.edu.vn.Backend.DTO.response.PaypalCaptureResponseDTO;
import fpt.edu.vn.Backend.config.VnPayConfig;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.CurrencyType;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepos paymentRepos;
    private final AccountRepos accountRepos;
    private final CurrencyService currencyService;
    private final NotificationService notificationService;
    private final PaypalService paypalService;

    @Autowired
    public PaymentServiceImpl(PaymentRepos paymentRepos, AccountRepos accountRepos, CurrencyService currencyService, NotificationService notificationService, PaypalService paypalService) {
        this.paymentRepos = paymentRepos;
        this.accountRepos = accountRepos;
        this.currencyService = currencyService;
        this.notificationService = notificationService;
        this.paypalService = paypalService;
    }
    @Transactional
    @Override
    public String createPayment(PaymentRequest paymentRequest) {
        Preconditions.checkState(paymentRequest.getType() == Payment.Type.DEPOSIT ||
                paymentRequest.getType() == Payment.Type.WITHDRAW,
                "Type must be DEPOSIT or WITHDRAW");
        log.info("createPayment: " + paymentRequest);
        try {
            Payment payment = new Payment();
            payment.setMethod(paymentRequest.getType() == Payment.Type.WITHDRAW ?
                    Payment.Method.MANUAL :
                    paymentRequest.getMethod());

            if (payment.getMethod() == Payment.Method.VNPAY) {
                BigDecimal exchangeRate = currencyService.getExchangeRate(CurrencyType.VND);
                log.info("exchange rate to VND: " + exchangeRate);
                BigDecimal newAmount = paymentRequest.getAmount().divide(exchangeRate, 10, RoundingMode.HALF_DOWN);
                payment.setPaymentAmount(newAmount);
            } else {
                payment.setPaymentAmount(paymentRequest.getAmount());
            }
            log.info("payment amount: " + payment.getPaymentAmount());

            if (payment.getPaymentAmount().compareTo(new BigDecimal(1)) < 0) {
                throw new InvalidInputException("Amount must be greater than 1 USD");
            }
            if (payment.getPaymentAmount().compareTo(new BigDecimal(100_000_000)) > 0) {
                throw new InvalidInputException("Amount must be smaller than 100,000,000 USD");
            }

            Account acc = accountRepos.findByAccountId(paymentRequest.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + paymentRequest.getAccountId()));

            if (paymentRequest.getType() == Payment.Type.WITHDRAW) {
                Preconditions.checkState(acc.getBalance().subtract(paymentRequest.getAmount())
                        .compareTo(BigDecimal.ZERO) >= 0, "Insufficient balance");
            }

            payment.setType(paymentRequest.getType()); // must always be DEPOSIT
            payment.setStatus(Payment.Status.PENDING);
            payment.setAccount(acc);
            Payment savedPayment = paymentRepos.save(payment);

            if (savedPayment.getType() == Payment.Type.WITHDRAW) {
                acc.setBalance(acc.getBalance().subtract(paymentRequest.getAmount()));
                accountRepos.save(acc); // lock the withdrawal amount
                return "Withdraw payment created successfully";
            }

            if (savedPayment.getMethod() == Payment.Method.VNPAY) {
                VnPayPaymentRequestDTO vnPayPaymentRequestDTO = VnPayPaymentRequestDTO.builder()
                        .accountId(savedPayment.getAccount().getAccountId())
                        .vnp_txnRef(savedPayment.getPaymentId())
                        .vnp_Amount(paymentRequest.getAmount())
                        .vnp_OrderInfo(paymentRequest.getOrderInfoType() + "-" + savedPayment.getPaymentId())
                        .build();
                return createVNPayPayment(vnPayPaymentRequestDTO, paymentRequest.getIpAddr());
            }

            if (savedPayment.getMethod() == Payment.Method.PAYPAL) {
                PayPalPaymentRequestDTO paypalPaymentRequestDTO = PayPalPaymentRequestDTO.builder()
                        .accountId(savedPayment.getAccount().getAccountId())
                        .amount(paymentRequest.getAmount())
                        .orderInfo(paymentRequest.getOrderInfoType() + "-" + savedPayment.getPaymentId())
                        .transId(savedPayment.getPaymentId())
                        .build();
                return paypalService.createOrder(paypalPaymentRequestDTO);
            }

            throw new IllegalStateException("No handler for payment " + savedPayment.getMethod());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("An error occurred while creating payment: " + e.getMessage());
            throw new InvalidInputException("Failed to create payment", e);
        }
    }
    @Transactional
    @Override
    public PaymentDTO getPaymentById(int id) {
        try {
            Payment payment = paymentRepos.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
            return new PaymentDTO(payment);
        } catch (Exception e) {
            System.err.println("An error occurred while fetching payment: " + e.getMessage());
            throw new ResourceNotFoundException("Failed to get payment by id", e);
        }
    }

    @Transactional
    @Override
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Preconditions.checkNotNull(paymentDTO.getPaymentAmount());
        Preconditions.checkState(
                paymentDTO.getType() == Payment.Type.DEPOSIT ||
                paymentDTO.getType() == Payment.Type.WITHDRAW,
                "Can only create deposit or withdraw payment");
        Preconditions.checkState(paymentDTO.getPaymentAmount().signum() > 0,
                "Payment amount must be greater than 0");

        Account acc = accountRepos.findById(paymentDTO.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + paymentDTO.getAccountId()));
        Preconditions.checkState(paymentDTO.getType() != Payment.Type.WITHDRAW ||
                        acc.getBalance().subtract(paymentDTO.getPaymentAmount()).signum() >= 0,
                "Insufficient balance");

        Payment payment = new Payment();
        payment.setPaymentAmount(paymentDTO.getPaymentAmount());
        payment.setCreateDate(LocalDateTime.now());
        payment.setType(paymentDTO.getType());
        payment.setStatus(Payment.Status.SUCCESS); // must always SUCCESS
        payment.setMethod(Payment.Method.MANUAL); // must always MANUAL
        payment.setAccount(acc);
        Payment savedPayment = paymentRepos.save(payment);

        if (paymentDTO.getType() == Payment.Type.DEPOSIT) {
            acc.setBalance(acc.getBalance().add(paymentDTO.getPaymentAmount()));
        } else if (paymentDTO.getType() == Payment.Type.WITHDRAW) {
            acc.setBalance(acc.getBalance().subtract(paymentDTO.getPaymentAmount()));
        }
        accountRepos.save(acc);

        return new PaymentDTO(savedPayment);
    }

    @Override
    public Page<PaymentDTO> getAllPayment(Pageable pageable,
                                          @Nullable Payment.Type type, @Nullable Payment.Status status,
                                          @Nullable LocalDateTime fromDate, @Nullable LocalDateTime toDate,
                                          @Nullable Integer accountId,
                                          @Nullable String keyword) {
        PaymentSpecification spec = new PaymentSpecification(type, status, fromDate, toDate, accountId, keyword);
        return paymentRepos.findAll(spec, pageable).map(PaymentDTO::new);
    }

    @Transactional
    @Override
    public PaymentDTO updatePayment(PaymentDTO paymentDTO) {
        Payment payment = paymentRepos.findById(paymentDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + paymentDTO.getId()));
        Preconditions.checkState(payment.getStatus() == Payment.Status.PENDING,
                "Can only update pending payment");
        if (paymentDTO.getStatus() == Payment.Status.SUCCESS && payment.getType() == Payment.Type.DEPOSIT) {
            Account acc = payment.getAccount();
            acc.setBalance(acc.getBalance().add(payment.getPaymentAmount()));
            accountRepos.save(acc);
        }
        else if (paymentDTO.getStatus() == Payment.Status.FAILED && payment.getType() == Payment.Type.WITHDRAW) {
            Account acc = payment.getAccount();
            acc.setBalance(acc.getBalance().add(payment.getPaymentAmount())); // refund
            accountRepos.save(acc);
        }
        payment.setStatus(paymentDTO.getStatus());
        payment.setFailedReason(paymentDTO.getFailedReason());
        Payment updatedPayment = paymentRepos.save(payment);
        return new PaymentDTO(updatedPayment);
    }
    @Transactional
    @Override
    public void updatePaymentByStatus(UpdatePaymentStatusRequestDTO request) {
        for (Integer paymentId : request.getPaymentId()) {
            try {
                Optional<Payment> payment = paymentRepos.findById(paymentId);
                Payment payments = payment.get();
                if (payments != null) {
                    payments.setStatus(Payment.Status.valueOf(request.getStatus().toUpperCase()));
                    paymentRepos.save(payments);
                } else {
                    throw new ResourceNotFoundException("Payment not found with ID: " + paymentId);
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + request.getStatus().toUpperCase());
            } catch (Exception e) {
                throw new ConsignmentServiceException("An error occurred while updating Payment with ID: " + paymentId);
            }
        }
    }
    @Transactional
    @Override
    public String createVNPayPayment(VnPayPaymentRequestDTO paymentRequest, String vnp_IpAddr) throws UnsupportedEncodingException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", paymentRequest.getVnp_Amount().toBigInteger().multiply(BigInteger.valueOf(100)).toString());
        vnp_Params.put("vnp_CreateDate", formatter.format(now));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_Locale", VnPayConfig.vnp_Locale);
        vnp_Params.put("vnp_OrderInfo", paymentRequest.getVnp_OrderInfo());
        vnp_Params.put("vnp_OrderType", "250000");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_ExpireDate", formatter.format(now.plusMinutes(15)));
        vnp_Params.put("vnp_TxnRef", String.valueOf(paymentRequest.getVnp_txnRef()));

        Account account = accountRepos.findByAccountId(paymentRequest.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id "));
        BillingDTO billing = BillingDTO.builder()
                .vnp_Bill_Address("123")
                .vnp_Bill_City("Hanoi")
                .vnp_Bill_Country("Vietnam")
                .vnp_Bill_Email(account.getEmail())
                .vnp_Bill_FullName(normalize(account.getNickname()))
                .vnp_Bill_Mobile("0123456789")
                .vnp_Bill_State("Hanoi")
                .build();

        //Billing
        vnp_Params.put("vnp_Bill_Mobile", billing.getVnp_Bill_Mobile());
        vnp_Params.put("vnp_Bill_Email", billing.getVnp_Bill_Email());

        if (billing.getVnp_Bill_FullName() != null && !billing.getVnp_Bill_FullName().isEmpty()) {
            int idx = billing.getVnp_Bill_FullName().indexOf(' ');
            if (idx >= 0) {
                String firstName = billing.getVnp_Bill_FullName().substring(0, idx);
                String lastName = billing.getVnp_Bill_FullName().substring(billing.getVnp_Bill_FullName().lastIndexOf(' ') + 1);
                vnp_Params.put("vnp_Bill_FirstName", firstName);
                vnp_Params.put("vnp_Bill_LastName", lastName);
            }
            vnp_Params.put("vnp_Bill_FirstName", billing.getVnp_Bill_FullName());
            vnp_Params.put("vnp_Bill_LastName", "");
        }

        InvoiceDTO invoice = InvoiceDTO.builder()
                .vnp_Inv_Address("123")
                .vnp_Inv_Company("FPT")
                .vnp_Inv_Customer(normalize(account.getNickname()))
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

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        log.info("Hash data: " + hashData);

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;

        log.info("VnPay URL: " + paymentUrl);

        return paymentUrl;
    }

    @Override
    public String capturePayment(PaymentCaptureRequestDTO dto) {
        if (dto.getMethod() == Payment.Method.PAYPAL) {
            PaypalCaptureResponseDTO res = paypalService.captureOrder(dto.getOrderId());
            if (res.getTransId() != null) {
                String status = new Gson().fromJson(res.getResponse(), JsonObject.class)
                        .getAsJsonPrimitive("status").getAsString();
                log.info("Payment order ID = {}, trans ID = {}, status = {} ", dto.getOrderId(), res.getTransId(), status);
                updatePayment(PaymentDTO.builder()
                        .id(res.getTransId())
                        .status(status.equals("COMPLETED") ? Payment.Status.SUCCESS : Payment.Status.FAILED)
                        .failedReason(status.equals("COMPLETED") ? null : "Failed to process payment callback from PAYPAL")
                        .build());
            }
            return res.getResponse();
        }
        throw new UnsupportedOperationException("Payment method not supported: " + dto.getMethod());
    }

    private String normalize(String str) {
        return StringUtils.stripAccents(str).replaceAll("[^\\w ]", "");
    }

    @Scheduled(timeUnit = TimeUnit.HOURS, fixedRate = 1, initialDelay = 0)
    @Transactional
    public void scheduleFixedRateTask() {
        List<Payment> list = paymentRepos.findAllPendingPaymentWithPaymentCreatedBefore(
                LocalDateTime.now().minusDays(7),
                Payment.Type.WITHDRAW
        );
        list.addAll(paymentRepos.findAllPendingPaymentWithPaymentCreatedBefore(
                LocalDateTime.now().minusDays(3),
                Payment.Type.DEPOSIT
        ));
        if (list.isEmpty()) return;
        List<NotificationDTO> toSend = new ArrayList<>();
        for (Payment p : list) {
            log.info("Cancelling payment {} due to inactivity", p.getPaymentId());
            p.setStatus(Payment.Status.FAILED);
            p.setFailedReason("Payment expired due to inactivity");
            toSend.add(NotificationDTO.builder()
                    .message(String.format(
                            "Your payment #%d was cancelled due to inactivity.",
                            p.getPaymentId()
                    ))
                    .userId(p.getAccount().getAccountId())
                    .build());
        }
        paymentRepos.saveAll(list);
        notificationService.sendBulkNotification(toSend);
    }
}

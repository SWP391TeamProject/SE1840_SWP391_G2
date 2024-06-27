package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.request.VnPayPaymentRequestDTO;
import fpt.edu.vn.Backend.config.VnPayConfig;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import fpt.edu.vn.Backend.service.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class PaymentServiceImplTest {

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Mock
    private PaymentRepos paymentRepos;

    @Mock
    private AccountRepos accountRepos;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void createVNPayPayment_HappyPath() throws UnsupportedEncodingException {
        // Given
        VnPayPaymentRequestDTO paymentRequest = VnPayPaymentRequestDTO.builder()
                .accountId(1)
                .vnp_Amount(new BigDecimal(10000))
                .vnp_OrderInfo("Order-1")
                .vnp_txnRef(1)
                .build();
        String vnp_IpAddr = "192.168.1.1";

        Account account = new Account();
        account.setAccountId(1);
        account.setEmail("test@test.com");
        account.setNickname("Test User");

        when(accountRepos.findByAccountId(paymentRequest.getAccountId())).thenReturn(Optional.of(account));



    }

    @Test
    void createVNPayPayment_AccountNotFound() {
        // Given
        VnPayPaymentRequestDTO paymentRequest = VnPayPaymentRequestDTO.builder()
                .accountId(1)
                .vnp_Amount(new BigDecimal(10000))
                .vnp_OrderInfo("Order-1")
                .vnp_txnRef(1)
                .build();
        String vnp_IpAddr = "192.168.1.1";

        when(accountRepos.findByAccountId(paymentRequest.getAccountId())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> paymentService.createVNPayPayment(paymentRequest, vnp_IpAddr));
    }
}
package fpt.edu.vn.Backend.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.DTO.request.PayPalPaymentRequestDTO;
import fpt.edu.vn.Backend.DTO.response.PaypalCaptureResponseDTO;
import fpt.edu.vn.Backend.exception.PaypalRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Service
public class PaypalServiceImpl implements PaypalService {
    private static final String PAYPAL_ACCESS_TOKEN_KEY = "PaypalAccessToken";
    private static final String PAYPAL_PENDING_ORDER_KEY = "PaypalPendingOrders";
    private static final Logger logger = LoggerFactory.getLogger(PaypalServiceImpl.class);

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${paypal.api-endpoint}")
    private String apiEndpoint;

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Autowired
    public PaypalServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String getAccessToken() {
        String accessToken = (String) redisTemplate.opsForValue().get(PAYPAL_ACCESS_TOKEN_KEY);
        if (accessToken != null)
            return accessToken;

        logger.info("Getting PayPal access token");

        String auth = clientId + ":" + clientSecret;
        auth = Base64.getEncoder().encodeToString(auth.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + auth);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = apiEndpoint + "/v1/oauth2/token";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> res = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(
                        "grant_type=client_credentials",
                        headers
                ),
                String.class
        );

        if (!res.getStatusCode().is2xxSuccessful()) {
            logger.error("Failed to get PayPal access token: {}", res);
            throw new RuntimeException("Failed to get PayPal access token");
        }

        JsonObject json = new Gson().fromJson(res.getBody(), JsonObject.class);
        accessToken = json.get("access_token").getAsString();
        int expiresIn = json.get("expires_in").getAsInt() - 5;
        redisTemplate.opsForValue().set(PAYPAL_ACCESS_TOKEN_KEY, accessToken, expiresIn, TimeUnit.SECONDS);

        return accessToken;
    }

    @Override
    public String createOrder(PayPalPaymentRequestDTO dto) throws PaypalRequestException {
        JsonObject payload = new JsonObject();
        payload.addProperty("intent", "CAPTURE");

        JsonObject amount = new JsonObject();
        amount.addProperty("currency_code", "USD");
        amount.addProperty("value", dto.getAmount().toString());
        amount.addProperty("description", dto.getOrderInfo());
        amount.addProperty("reference_id", dto.getTransId());
        amount.addProperty("custom_id", dto.getTransId());
        amount.addProperty("invoice_id", dto.getTransId());

        JsonObject purchaseUnit = new JsonObject();
        purchaseUnit.add("amount", amount);

        JsonArray purchaseUnits = new JsonArray();
        purchaseUnits.add(purchaseUnit);

        payload.add("purchase_units", purchaseUnits);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = apiEndpoint + "/v2/checkout/orders";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> res = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(
                        new Gson().toJson(payload),
                        headers
                ),
                String.class
        );

        if (!res.getStatusCode().is2xxSuccessful()) {
            logger.error("Failed to create PayPal order: {}", res);
            throw new PaypalRequestException("Failed to create PayPal order");
        }

        JsonObject json = new Gson().fromJson(res.getBody(), JsonObject.class);
        String id = json.getAsJsonPrimitive("id").getAsString();

        redisTemplate.opsForHash().put(PAYPAL_PENDING_ORDER_KEY, id, dto.getTransId());

        return id;
    }

    @Override
    public PaypalCaptureResponseDTO captureOrder(String orderId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = apiEndpoint + "/v2/checkout/orders/"+orderId+"/capture";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> res = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(
                        headers
                ),
                String.class
        );

        if (!res.getStatusCode().is2xxSuccessful()) {
            logger.error("Failed to capture PayPal order: {}", res);
            throw new PaypalRequestException("Failed to capture PayPal order");
        }

        Integer transId = (Integer) redisTemplate.opsForHash().get(PAYPAL_PENDING_ORDER_KEY, orderId);
        if (transId == null) {
            logger.info("Capture success but not found transId in the cache {}", orderId);
        } else {
            redisTemplate.opsForHash().delete(PAYPAL_PENDING_ORDER_KEY, orderId);
        }

        return PaypalCaptureResponseDTO.builder().response(res.getBody()).transId(transId).build();
    }
}

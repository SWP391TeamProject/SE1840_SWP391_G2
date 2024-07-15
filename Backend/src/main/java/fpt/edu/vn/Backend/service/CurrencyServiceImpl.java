package fpt.edu.vn.Backend.service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.pojo.CurrencyType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CurrencyServiceImpl implements CurrencyService {
    private static final String EXCHANGE_RATE_KEY = "CurrencyExchangeRates";
    private static final String LAST_FETCH_KEY = "CurrencyExchangeRateFetchTime";
    private static final Logger logger = LoggerFactory.getLogger(CurrencyServiceImpl.class);
    private static final EnumMap<CurrencyType, Double> COMPUTED_RATES = new EnumMap<>(CurrencyType.class);

    static {
        COMPUTED_RATES.put(CurrencyType.USD, 1.0);
    }


    @Value("${currencyapi.apikey}")
    private String apiKey;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @EventListener(ApplicationReadyEvent.class)
    @Async
    public void initialize() {
        fetchExchangeRates();
    }

    @Override
    public Map<CurrencyType, Double> getExchangeRates() {
        fetchExchangeRates();
        Map<CurrencyType, Double> rates = new HashMap<>();
        for (Map.Entry<Object, Object> e : redisTemplate.opsForHash().entries(EXCHANGE_RATE_KEY).entrySet()) {
            rates.put(CurrencyType.valueOf((String) e.getKey()), (Double) e.getValue());
        }
        return Collections.unmodifiableMap(rates);
    }

    @Override
    public Double getExchangeRate(CurrencyType currency) {
        fetchExchangeRates();
        Object v = redisTemplate.opsForHash().get(EXCHANGE_RATE_KEY, currency.name());
        return v == null ? null : (Double) v;
    }

    @Override
    public long getLastUpdate() {
        Object v = redisTemplate.opsForValue().get(LAST_FETCH_KEY);
        return v == null ? System.currentTimeMillis() : (Long) v;
    }

    private synchronized void fetchExchangeRates() {
        if (Objects.equals(redisTemplate.hasKey(EXCHANGE_RATE_KEY), true))
            return;

        logger.info("Fetching exchange rates...");
        for (CurrencyType currency : COMPUTED_RATES.keySet()) {
            redisTemplate.opsForHash().put(EXCHANGE_RATE_KEY, currency.name(), COMPUTED_RATES.get(currency));
        }

        StringJoiner currenciesToFetch = new StringJoiner(",");
        for (CurrencyType currency : CurrencyType.values()) {
            if (!COMPUTED_RATES.containsKey(currency)) {
                currenciesToFetch.add(currency.name());
            }
        }

        String url = String.format("https://api.currencyapi.com/v3/latest?apikey=%s&currencies=%s", apiKey, currenciesToFetch);

        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(jsonResponse, JsonObject.class);
        JsonObject dataObject = jsonObject.getAsJsonObject("data");

        for (Map.Entry<String, JsonElement> entry : dataObject.entrySet()) {
            JsonObject currencyObject = entry.getValue().getAsJsonObject();
            String code = currencyObject.get("code").getAsString();
            double value = currencyObject.get("value").getAsDouble();
            redisTemplate.opsForHash().put(EXCHANGE_RATE_KEY, code, value);
        }

        redisTemplate.expire(EXCHANGE_RATE_KEY, 1, TimeUnit.DAYS);
        redisTemplate.opsForValue().set(LAST_FETCH_KEY, System.currentTimeMillis(), 1, TimeUnit.DAYS);
    }
}

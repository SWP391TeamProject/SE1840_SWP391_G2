package fpt.edu.vn.Backend.service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.pojo.CurrencyType;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.EnumMap;
import java.util.Map;
import java.util.StringJoiner;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    private static final Logger logger = LoggerFactory.getLogger(CurrencyServiceImpl.class);
    private static final EnumMap<CurrencyType, Double> COMPUTED_RATES = new EnumMap<>(CurrencyType.class);

    static {
        COMPUTED_RATES.put(CurrencyType.USD, 1.0);
    }

    private final Map<CurrencyType, Double> exchangeRatesCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;

    @Value("${currencyapi.apikey}")
    private String apiKey;

    @EventListener(ApplicationReadyEvent.class)
    @Async
    public void initialize() {
        fetchExchangeRates();
    }

    @Override
    public Map<CurrencyType, Double> getExchangeRates() {
        fetchExchangeRates();
        return Collections.unmodifiableMap(exchangeRatesCache);
    }

    @Override
    public Double getExchangeRate(CurrencyType currency) {
        fetchExchangeRates();
        return exchangeRatesCache.get(currency);
    }

    @Override
    public long getLastUpdate() {
        return lastFetchTime;
    }

    private boolean shouldFetchFromAPI() {
        return System.currentTimeMillis() - lastFetchTime > TimeUnit.HOURS.toMillis(12);
    }

    private synchronized void fetchExchangeRates() {
        if (!shouldFetchFromAPI())
            return;

        logger.info("Fetching exchange rates...");
        for (CurrencyType currency : COMPUTED_RATES.keySet()) {
            exchangeRatesCache.put(currency, COMPUTED_RATES.get(currency));
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
            exchangeRatesCache.put(CurrencyType.valueOf(code), value);
        }

        lastFetchTime = System.currentTimeMillis();
    }
}

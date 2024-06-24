package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.CurrencyType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
        COMPUTED_RATES.put(CurrencyType.JACK, 5_000_000.0 / 25_000);
        COMPUTED_RATES.put(CurrencyType.FPT, 32_500_000.0 / 25_000);
    }

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<CurrencyType, Double> exchangeRatesCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;

    @Value("${currencyfreaks.apikey}")
    private String apiKey;

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

    private void fetchExchangeRates() {
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

        String url = String.format("https://api.currencyfreaks.com/v2.0/rates/latest?apikey=%s&symbols=%s", apiKey, currenciesToFetch);
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        Map<String, String> rates = (Map<String, String>) response.get("rates");

        for (Map.Entry<String, String> entry : rates.entrySet()) {
            exchangeRatesCache.put(CurrencyType.valueOf(entry.getKey()), Double.valueOf(entry.getValue()));
        }

        lastFetchTime = System.currentTimeMillis();
    }
}

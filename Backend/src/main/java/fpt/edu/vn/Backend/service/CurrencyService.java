package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.CurrencyType;

import java.math.BigDecimal;
import java.util.Map;

public interface CurrencyService {
    Map<CurrencyType, BigDecimal> getExchangeRates();
    BigDecimal getExchangeRate(CurrencyType currency);
    long getLastUpdate();
}

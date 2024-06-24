package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.CurrencyType;

import java.util.Map;

public interface CurrencyService {
    Map<CurrencyType, Double> getExchangeRates();
    Double getExchangeRate(CurrencyType currency);
    long getLastUpdate();
}

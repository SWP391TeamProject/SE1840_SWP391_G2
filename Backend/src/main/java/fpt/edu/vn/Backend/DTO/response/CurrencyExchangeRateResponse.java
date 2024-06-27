package fpt.edu.vn.Backend.DTO.response;

import fpt.edu.vn.Backend.pojo.CurrencyType;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class CurrencyExchangeRateResponse {
    private Map<CurrencyType, Double> rates;
    private long lastUpdate;
}

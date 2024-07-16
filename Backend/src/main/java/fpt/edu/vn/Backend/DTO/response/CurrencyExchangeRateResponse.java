package fpt.edu.vn.Backend.DTO.response;

import fpt.edu.vn.Backend.pojo.CurrencyType;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
public class CurrencyExchangeRateResponse implements Serializable {
    private Map<CurrencyType, Double> rates;
    private long lastUpdate;
}

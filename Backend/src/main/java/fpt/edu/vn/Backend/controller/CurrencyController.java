package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.response.CurrencyExchangeRateResponse;
import fpt.edu.vn.Backend.service.CurrencyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin("*")
@Slf4j
public class CurrencyController {
    @Autowired
    private CurrencyService currencyService;

    @GetMapping("/exchange-rates")
    public ResponseEntity<CurrencyExchangeRateResponse> getExchangeRates() {
        return ResponseEntity.ok(CurrencyExchangeRateResponse.builder()
                .rates(currencyService.getExchangeRates())
                .lastUpdate(currencyService.getLastUpdate())
                .build());
    }
}

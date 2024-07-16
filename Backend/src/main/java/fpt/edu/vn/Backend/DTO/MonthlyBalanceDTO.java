package fpt.edu.vn.Backend.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyBalanceDTO implements Serializable {
    private YearMonth month;
    private BigDecimal balance;

}

package fpt.edu.vn.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.YearMonth;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentsByDateDTO {
    private YearMonth month;
    private long count;
}

package fpt.edu.vn.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MonthlyUserDTO {
    private int month;
    private long totalUser;
}

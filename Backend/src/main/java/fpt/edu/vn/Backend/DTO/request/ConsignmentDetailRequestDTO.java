package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsignmentDetailRequestDTO {
    private String description;
    private BigDecimal price;
    private String status;
    private int accountId;
    private int consignmentId;

}

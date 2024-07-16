package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConsignmentDetailRequestDTO implements Serializable {
    private String description;
    private BigDecimal price;
    private String status;
    private int accountId;
    private int consignmentId;

}

package fpt.edu.vn.Backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ConsignmentDetailDTO {
    private Long consignmentId; // Assuming ConsignmentDetailKey has these fields
    private Long accountId;
    private String description;
    private String type; // Use String for the enum representation in DTO
    private BigDecimal price;
}

package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
public class ConsignmentDTO {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private Integer staffId;
    List<ConsignmentDetailDTO> consignmentDetails;

    public ConsignmentDTO(int consignmentId, String status, String preferContact, LocalDateTime createDate, LocalDateTime updateDate,Integer staffId, List<ConsignmentDetailDTO> consignmentDetails) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.staffId = staffId;
        this.consignmentDetails = consignmentDetails;
    }

// getters and setters
    // ...
}
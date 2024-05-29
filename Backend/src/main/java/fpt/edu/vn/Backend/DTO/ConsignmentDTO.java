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
    private Integer staffId;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    List<ConsignmentDetailDTO> consignmentDetails;

    public ConsignmentDTO(int consignmentId, String status, String preferContact, Integer staffId, LocalDateTime createDate, LocalDateTime updateDate, List<ConsignmentDetailDTO> consignmentDetails) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.staffId = staffId;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.consignmentDetails = consignmentDetails;
    }

    // getters and setters
    // ...
}
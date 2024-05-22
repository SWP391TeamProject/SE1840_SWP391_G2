package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
public class ConsignmentDTO {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public ConsignmentDTO(int consignmentId, String status, String preferContact, LocalDateTime createDate, LocalDateTime updateDate) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    // getters and setters
    // ...
}
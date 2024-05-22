package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class ConsignmentDTO {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public ConsignmentDTO(Consignment consignment) {
        this.consignmentId = consignment.getConsignmentId();
        this.status = consignment.getStatus().name();
        this.createDate = consignment.getCreateDate();
        this.updateDate = consignment.getUpdateDate();
        this.preferContact = consignment.getPreferContact().name();
    }
    // getters and setters
    // ...
}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class ConsignmentDTO {
    private int consignmentId;
    private int requesterId;
    private int staffId;
    private BigDecimal initialPrice;
    private String initialEvaluation;
    private BigDecimal finalPrice;
    private String finalEvaluation;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    ConsignmentDTO(Consignment consignment) {
        this.consignmentId = consignment.getConsignmentId();

//        this.status = consignment.getStatus();
        this.createDate = consignment.getCreateDate();
        this.updateDate = consignment.getUpdateDate();
    }
    // getters and setters
    // ...
}
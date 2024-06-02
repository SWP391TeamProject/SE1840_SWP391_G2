package fpt.edu.vn.Backend.DTO;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
public class ConsignmentDTO {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private AccountDTO staff;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    List<ConsignmentDetailDTO> consignmentDetails;

    public ConsignmentDTO(int consignmentId, String status, String preferContact, AccountDTO staff, LocalDateTime createDate, LocalDateTime updateDate, List<ConsignmentDetailDTO> consignmentDetails) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.staff = staff;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.consignmentDetails = consignmentDetails;
    }

    // getters and setters
    // ...
}
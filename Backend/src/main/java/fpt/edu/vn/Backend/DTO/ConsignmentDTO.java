package fpt.edu.vn.Backend.DTO;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
public class ConsignmentDTO implements Serializable {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private AccountDTO user;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    List<ConsignmentDetailDTO> consignmentDetails;

    public ConsignmentDTO(int consignmentId, String status, String preferContact, AccountDTO user, LocalDateTime createDate, LocalDateTime updateDate, List<ConsignmentDetailDTO> consignmentDetails) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.user = user;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.consignmentDetails = consignmentDetails;
        if(user !=null) user.setPassword("");
    }

    // getters and setters
    // ...
}
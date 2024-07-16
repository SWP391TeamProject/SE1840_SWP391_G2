package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class UpdateConsignmentStatusRequestDTO {
    private List <Integer> consignmentId;
    private String status;
}

package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ConsignmentRequestDTO {
    private String accountId;
    private String contactName;
    private String phone;
    private String email;
    private String preferContact;
}
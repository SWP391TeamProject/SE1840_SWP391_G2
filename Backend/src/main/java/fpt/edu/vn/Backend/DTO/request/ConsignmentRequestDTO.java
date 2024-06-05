package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ConsignmentRequestDTO {
    private int accountId;
    private String contactName;
    private String description;
    private String phone;
    private String email;
    private String preferContact;
    private List<MultipartFile> files;
}
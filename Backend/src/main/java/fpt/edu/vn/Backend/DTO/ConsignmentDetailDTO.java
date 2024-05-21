package fpt.edu.vn.Backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ConsignmentDetailDTO {
    private int consignmentDetailId;
    private String description;
    private String type; // Use String for the enum representation in DTO
    private BigDecimal price;
    private int consignmentId; // Use int for the Consignment reference in DTO
    private int accountId; // Use int for the Account reference in DTO
    private List<Integer> attachmentIds; // Use List of Integer for the Attachment references in DTO
}
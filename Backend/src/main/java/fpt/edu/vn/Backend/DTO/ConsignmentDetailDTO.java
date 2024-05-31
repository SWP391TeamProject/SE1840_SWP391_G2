package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@Slf4j
public class ConsignmentDetailDTO {
    private int consignmentDetailId;
    private String description;
    private String type; // Use String for the enum representation in DTO
    private BigDecimal price;
    private int consignmentId; // Use int for the Consignment reference in DTO
    private int accountId; // Use int for the Account reference in DTO
    private List<AttachmentDTO> attachments; // Use List of Integer for the Attachment references in DTO
    public ConsignmentDetailDTO(int consignmentDetailId, String description, String type, BigDecimal price, int consignmentId, int accountId, List<AttachmentDTO> attachmentIds) {
        this.consignmentDetailId = consignmentDetailId;
        this.description = description;
        this.type = type;
        this.price = price;
        this.consignmentId = consignmentId;
        this.accountId = accountId;
        this.attachments = attachmentIds;
    }

    public ConsignmentDetailDTO(ConsignmentDetail consignmentDetail) {
        this.consignmentDetailId = consignmentDetail.getConsignmentDetailId();
        this.description = consignmentDetail.getDescription();
        this.type = String.valueOf(consignmentDetail.getType());
        this.price = consignmentDetail.getPrice();
        this.consignmentId = consignmentDetail.getConsignment().getConsignmentId();
        this.accountId = consignmentDetail.getAccount().getAccountId();
        this.attachments = consignmentDetail.getAttachments()==null?null:consignmentDetail.getAttachments().stream()
                .map(AttachmentDTO::new)
                .collect(Collectors.toList());

    }

}
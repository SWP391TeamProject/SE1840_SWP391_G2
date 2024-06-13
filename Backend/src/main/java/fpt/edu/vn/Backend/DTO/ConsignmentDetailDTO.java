package fpt.edu.vn.Backend.DTO;

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
    private String status; // Use String for the enum representation in DTO
    private BigDecimal price;
    private int consignmentId; // Use int for the Consignment reference in DTO
    private AccountDTO account; // Use int for the Account reference in DTO
    private List<AttachmentDTO> attachments; // Use List of Integer for the Attachment references in DTO
    public ConsignmentDetailDTO(int consignmentDetailId, String description, String type, BigDecimal price, int consignmentId, AccountDTO accountId, List<AttachmentDTO> attachmentIds) {
        this.consignmentDetailId = consignmentDetailId;
        this.description = description;
        this.status = type;
        this.price = price;
        this.consignmentId = consignmentId;
        this.account = accountId;
        this.attachments = attachmentIds;
        if(account!=null) account.setPassword("");

    }

    public ConsignmentDetailDTO(ConsignmentDetail consignmentDetail) {
        this.consignmentDetailId = consignmentDetail.getConsignmentDetailId();
        this.description = consignmentDetail.getDescription();
        this.status = String.valueOf(consignmentDetail.getStatus());
        this.price = consignmentDetail.getPrice();
        this.consignmentId = consignmentDetail.getConsignment().getConsignmentId();
        this.account = new AccountDTO(consignmentDetail.getAccount());
        this.attachments = consignmentDetail.getAttachments()==null?null:consignmentDetail.getAttachments().stream()
                .map(AttachmentDTO::new)
                .collect(Collectors.toList());
        if(account!=null) account.setPassword("");
    }

}
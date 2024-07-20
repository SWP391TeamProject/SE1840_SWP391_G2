package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@Slf4j
public class ConsignmentDetailDTO implements Serializable {
    private int consignmentDetailId;
    private String description;
    private String status; // Use String for the enum representation in DTO
    private BigDecimal price;
    private int consignmentId; // Use int for the Consignment reference in DTO
    private AccountDTO account; // Use int for the Account reference in DTO
    private List<AttachmentDTO> attachments; // Use List of Integer for the Attachment references in DTO
    private LocalDateTime createDate;

    public ConsignmentDetailDTO(int consignmentDetailId, String description, String type, BigDecimal price, int consignmentId, AccountDTO accountId, List<AttachmentDTO> attachmentIds, LocalDateTime createDate) {
        this.consignmentDetailId = consignmentDetailId;
        this.description = description;
        this.status = type;
        this.price = price;
        this.consignmentId = consignmentId;
        this.account = accountId;
        this.attachments = attachmentIds;
        if(account!=null) account.setPassword("");
        this.createDate = createDate;
    }

    public ConsignmentDetailDTO(ConsignmentDetail consignmentDetail) {
        this.consignmentDetailId = consignmentDetail.getConsignmentDetailId();
        this.description = consignmentDetail.getDescription();
        this.status = String.valueOf(consignmentDetail.getType());
        this.price = consignmentDetail.getPrice();
        this.consignmentId = consignmentDetail.getConsignment().getConsignmentId();
        this.account = AccountDTO.redacted(consignmentDetail.getAccount());
        this.attachments = consignmentDetail.getAttachments()==null?null:consignmentDetail.getAttachments().stream()
                .map(AttachmentDTO::new)
                .collect(Collectors.toList());
        if(account!=null) account.setPassword("");
        this.createDate = consignmentDetail.getCreateDate();
    }

}
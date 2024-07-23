package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ConsignmentDTO implements Serializable {
    private int consignmentId;
    private String status;
    private String preferContact; // Use String for the enum representation in DTO
    private AccountDTO user;
    private AccountDTO staff;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String contactName;
    private String color;
    private Double weight;
    private String metal;
    private String gemstone;
    private String measurement;
    private String condition;
    private String stamped;
    private Integer createdItemId;
    private String secretCode;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    List<ConsignmentDetailDTO> consignmentDetails;
    private List<AttachmentDTO> attachments; // Use List of Integer for the Attachment references in DTO


    public ConsignmentDTO(Consignment consignment) {
        this.consignmentId = consignment.getConsignmentId();
        this.status = String.valueOf(consignment.getStatus());
        this.preferContact = String.valueOf(consignment.getPreferContact());
        this.user = AccountDTO.redacted(consignment.getUser());
        this.staff = consignment.getStaff() == null ? null : AccountDTO.redacted(consignment.getStaff());
        this.contactEmail = consignment.getContactEmail();
        this.contactPhone = consignment.getContactPhone();
        this.contactName = consignment.getContactName();
        this.description = consignment.getDescription();
        this.color = consignment.getColor();
        this.weight = consignment.getWeight();
        this.metal = consignment.getMetal();
        this.gemstone = consignment.getGemstone();
        this.measurement = consignment.getMeasurement();
        this.condition = consignment.getCondition();
        this.stamped = consignment.getStamped();
        this.secretCode = consignment.getSecretCode();
        if (consignment.getStatus() == Consignment.Status.FINISHED && consignment.getCreatedItem() != null)
            this.createdItemId = consignment.getCreatedItem().getItemId();
        this.createDate = consignment.getCreateDate();
        this.updateDate = consignment.getUpdateDate();
        this.consignmentDetails = consignment.getConsignmentDetails() == null ? new ArrayList<>() : consignment.getConsignmentDetails().stream()
                .map(ConsignmentDetailDTO::new)
                .toList();
        this.attachments = consignment.getAttachments() == null ? null : consignment.getAttachments().stream().map(AttachmentDTO::new).toList();
    }
// getters and setters
    // ...
}
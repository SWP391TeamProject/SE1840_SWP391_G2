package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
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
    private String color;
    private String size;
    private String weight;
    private String brand;
    private Integer age;
    private String material;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    List<ConsignmentDetailDTO> consignmentDetails;
    private List<AttachmentDTO> attachments; // Use List of Integer for the Attachment references in DTO


    public ConsignmentDTO(Consignment consignment) {
        this.consignmentId = consignment.getConsignmentId();
        this.status = String.valueOf(consignment.getStatus());
        this.preferContact = String.valueOf(consignment.getPreferContact());
        this.user = new AccountDTO(consignment.getUser());
        this.staff = consignment.getStaff() == null ? null : new AccountDTO(consignment.getStaff());
        this.user.setPassword("");
        if (this.staff != null) {
            this.staff.setPassword("");
        }
        this.description = consignment.getDescription();
        this.color = consignment.getColor();
        this.size = consignment.getSize();
        this.weight = consignment.getWeight();
        this.brand = consignment.getBrand();
        this.age = consignment.getAge();
        this.material = consignment.getMaterial();
        this.createDate = consignment.getCreateDate();
        this.updateDate = consignment.getUpdateDate();
        this.consignmentDetails = consignment.getConsignmentDetails() == null ? null : consignment.getConsignmentDetails().stream()
                .map(ConsignmentDetailDTO::new)
                .toList();
        this.attachments = consignment.getAttachments() == null ? null : consignment.getAttachments().stream().map(AttachmentDTO::new).toList();
    }
// getters and setters
    // ...
}
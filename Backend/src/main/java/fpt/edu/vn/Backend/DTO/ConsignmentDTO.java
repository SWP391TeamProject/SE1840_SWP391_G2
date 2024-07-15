package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import jakarta.persistence.Column;
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
    private String color;
    private String size;
    private String weight;
    private String brand;
    private Integer age;
    private String material;
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
        if (user != null) user.setPassword("");
    }

    public ConsignmentDTO(int consignmentId, String status, String preferContact, AccountDTO user, String color, String size, String weight, String brand, Integer age, String material, LocalDateTime createDate, LocalDateTime updateDate, List<ConsignmentDetailDTO> consignmentDetails) {
        this.consignmentId = consignmentId;
        this.status = status;
        this.preferContact = preferContact;
        this.user = user;
        this.color = color;
        this.size = size;
        this.weight = weight;
        this.brand = brand;
        this.age = age;
        this.material = material;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.consignmentDetails = consignmentDetails;
        if (user != null) user.setPassword("");
    }

    public ConsignmentDTO(Consignment consignment) {
        this.consignmentId = consignment.getConsignmentId();
        this.status = String.valueOf(consignment.getStatus());
        this.preferContact = String.valueOf(consignment.getPreferContact());
        this.user = new AccountDTO(consignment.getUser());
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
    }
// getters and setters
    // ...
}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ConsignmentRequestDTO {
    private Consignment.Status status;
    private Consignment.preferContact preferContact;
    private List<ConsignmentDetail> consignmentDetails;

    public Consignment toConsignment() {
        Consignment consignment = new Consignment();
        consignment.setStatus(this.status);
        consignment.setPreferContact(this.preferContact);
        consignment.setConsignmentDetails(this.consignmentDetails);
        return consignment;
    }
}
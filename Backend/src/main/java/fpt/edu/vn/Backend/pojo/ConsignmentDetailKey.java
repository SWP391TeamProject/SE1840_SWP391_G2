package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;

@Embeddable
public class ConsignmentDetailKey {
    @Column(name = "consignment_id")
    private int consignmentId;
    @Column(name = "account_id")
    private int accountId;
}

package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;

public class ConsignmentDetailKey {

    @Column(name = "consignment_id")
    private int consignmentId;
    @Column(name = "account_id")
    private int accountId;
}

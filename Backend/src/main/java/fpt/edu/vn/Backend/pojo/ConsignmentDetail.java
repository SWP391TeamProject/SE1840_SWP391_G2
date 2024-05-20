package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import jdk.jfr.Description;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ConsignmentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_detail_id")
    private int consignmentDetailId;

    @Column(name = "description")
    private String description;

    public enum ConsignmentStatus {
        REQUEST, INITIAL_EVALUATION, FINAL_EVALUATION, MANAGER_ACCEPTED, MANAGER_REJECTED
    }
    @Column(name = "type",nullable = false)
    @Enumerated(EnumType.STRING)
    private ConsignmentStatus type;

    @Column(name = "price")
    private BigDecimal price;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
}

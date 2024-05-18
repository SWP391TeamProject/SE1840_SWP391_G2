package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_id")
    private int consignmentId;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private Account requester;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Account staff;

    @Column(name = "initial_price")
    private BigDecimal initialPrice;
    @Column(name = "initial_evaluation")
    private String initialEvaluation;
    @Column(name = "final_price")
    private BigDecimal finalPrice;
    @Column(name = "final_evaluation")
    private String finalEvaluation;

    @Column(length = 30)
    private String status; // WAITING_STAFF, IN_INITIAL_VALUATION, etc.

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
}


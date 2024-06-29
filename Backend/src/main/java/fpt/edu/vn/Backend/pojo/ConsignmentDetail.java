package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
public class ConsignmentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_detail_id")
    private int consignmentDetailId;

    @Column(name = "description", length = 10000)
    private String description;

    public enum ConsignmentStatus {
        REQUEST, INITIAL_EVALUATION, FINAL_EVALUATION, MANAGER_ACCEPTED, MANAGER_REJECTED
    }
    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private ConsignmentStatus status;

    @Column(name = "price", precision = 20, scale = 8)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToMany
    @JoinColumn(name = "consignment_detail_id")
    private List<Attachment> attachments;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
}

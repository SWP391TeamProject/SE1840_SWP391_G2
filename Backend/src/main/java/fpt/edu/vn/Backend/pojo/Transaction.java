package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "[transaction]")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trans_id")
    private int transId;

    @Column(length = 30)
    private String type; // DEPOSIT_BALANCE, WITHDRAW_BALANCE, etc.

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account user;

    private BigDecimal amount;

    @Column(length = 2000)
    private String content;

    @Column(name = "reference_num")
    private Integer referenceNum; // Consider changing to Integer for null values

    @Column(length = 20, name = "payment_method")
    private String paymentMethod; // INTERNAL, MOMO, PAYPAL, BANK

    @Column(length = 30)
    private String status; // SUCCESS, PAYMENT_ERROR, INSUFFICIENT_BALANCE

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


    // ... (relationships to other entities like TransactionAuction will be added later)
}

package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    private BigDecimal paymentAmount;
    enum paymentStatus{
        PENDING, SUCCESS, FAILED
    }

    private paymentStatus paymentStatus;

    enum paymentType{
        DEPOSIT, WITHDRAW, TRANSACTION,AUCTION_DEPOSIT,BID
    }

    @Enumerated
    @Column(name = "payment_type")
    private paymentType paymentType;

    @OneToOne
    @JoinColumn(name = "deposit_id")
    private Deposit deposit;

    @Column(name = "payment_date")
    @CreationTimestamp
    private String paymentDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "bid_id")
    private Bid bid;


    @CreationTimestamp
    private LocalDateTime createDate;
    @UpdateTimestamp
    private LocalDateTime updateDate;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + paymentId;
        result = prime * result + (paymentAmount == null ? 0 : paymentAmount.hashCode());
        result = prime * result + (paymentDate == null ? 0 : paymentDate.hashCode());
        // exclude deposit from hashCode calculation
        return result;
    }
}

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

    @Column(name = "payment_amount")
    private BigDecimal paymentAmount;

    public enum Status {
        PENDING, SUCCESS, FAILED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private Status Status;

    public enum Type {
        DEPOSIT,
        WITHDRAW,
        AUCTION_DEPOSIT,
        AUCTION_BID,
        AUCTION_ORDER,
        AUCTION_DEPOSIT_REFUND,
        CONSIGNMENT_REWARD
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private Type Type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "deposit_id")
    private Deposit deposit;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "bid_id")
    private Bid bid;

    @CreationTimestamp
    private LocalDateTime createDate;

    @Override
    public int hashCode() {
        return paymentId;
    }
}

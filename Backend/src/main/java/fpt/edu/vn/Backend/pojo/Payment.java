package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.jetbrains.annotations.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "[transaction]")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private int paymentId;

    @Column(name = "transaction_amount", precision = 20, scale = 8)
    private BigDecimal paymentAmount;

    public enum Status {
        PENDING, SUCCESS, FAILED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status")
    private Status status;

    public enum Method {
        VNPAY, PAYPAL,MANUAL
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    @Nullable
    private Method method;

    public enum Type {
        DEPOSIT,
        WITHDRAW,
        AUCTION_DEPOSIT,
        AUCTION_ORDER,
        AUCTION_DEPOSIT_REFUND,
        CONSIGNMENT_REWARD
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type")
    private Type type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "deposit_id")
    private Deposit deposit;

    @OneToOne(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @CreationTimestamp
    private LocalDateTime createDate;

    @Override
    public int hashCode() {
        return paymentId;
    }
}

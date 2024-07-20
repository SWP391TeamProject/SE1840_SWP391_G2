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
import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "[order]")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id") // use transaction id as order id
    private int orderId;

    @Column(name = "fee", precision = 20, scale = 8)
    private BigDecimal fee;

    @Column(name = "shipping_address",columnDefinition ="NVARCHAR(1000)" )
    private String shippingAddress;

    @OneToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "transaction_id")
    private Payment payment;

    @Column(name = "shipping_note", length = 1000, columnDefinition = "NVARCHAR(1000)")
    private String shippingNote;

    @Column(name = "shipping_status")
    @Enumerated(EnumType.STRING)
    private ShippingStatus shippingStatus;

    public enum ShippingStatus {
        PACKAGING,
        DELIVERING,
        DELIVERED
    }

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private List<OrderDetail> orderDetails;

    @Override
    public int hashCode() {
        return orderId;
    }
}

package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    @Nullable
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_category_id")
    @NotNull
    private ItemCategory itemCategory;

    @Column(length = 300)
    @NotNull
    private String name;

    @Column(length = 5000)
    @NotNull
    private String description;

    @Column(name = "reserve_price")
    @NotNull
    private BigDecimal reservePrice;

    @Column(name = "buy_in_price")
    @NotNull
    private BigDecimal buyInPrice;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @NotNull
    private Status status;

    @CreationTimestamp
    @Column(name = "create_date")
    @NotNull
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    @NotNull
    private LocalDateTime updateDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @NotNull
    private Account owner;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @Nullable
    private Order order;

    public enum Status {
        VALUATING, QUEUE, IN_AUCTION, SOLD, UNSOLD
    }
}

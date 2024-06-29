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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_category_id") // This matches the column in the database
    private ItemCategory itemCategory;

    @Column(length = 500,columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(length = 10000,columnDefinition = "NVARCHAR(max)")
    private String description;

    @Column(name = "reserve_price", precision = 20, scale = 8)
    private BigDecimal reservePrice;

    @Column(name = "buy_in_price", precision = 20, scale = 8)
    private BigDecimal buyInPrice;

    public enum Status {
        VALUATING, QUEUE, IN_AUCTION, SOLD, UNSOLD
    }

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Account owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "item_id")
    private Set<Attachment> attachments;

}

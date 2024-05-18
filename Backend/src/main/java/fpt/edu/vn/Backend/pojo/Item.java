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
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_category_id") // This matches the column in the database
    private ItemCategory itemCategory;


    @Column(length = 300)
    private String name;

    @Column(length = 5000)
    private String description;

    @Column(name = "reserve_price")
    private BigDecimal reservePrice;

    @Column(name = "buy_in_price")
    private BigDecimal buyInPrice;

    @Column(length = 30)
    private String status; // VALUATING, QUEUE, IN_AUCTION, etc.

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;



    @OneToMany
    @JoinColumn(name = "item_id")
    private List<AuctionItem> auctionItems;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}

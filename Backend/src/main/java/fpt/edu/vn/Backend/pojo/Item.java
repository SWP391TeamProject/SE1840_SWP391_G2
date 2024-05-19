package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "itemId")
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

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


    @ManyToOne
    @JoinColumn(name = "category_id")
    private ItemCategory category;

    @OneToMany

    @JoinColumn(name = "item_id")
    private List<AuctionItem> auctionItems;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}

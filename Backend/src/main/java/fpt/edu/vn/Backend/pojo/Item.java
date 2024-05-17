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
    private int itemId;

    @Column(length = 300)
    private String name;

    @Column(length = 5000)
    private String description;

    private BigDecimal reservePrice;

    private BigDecimal sellerCommission;

    private BigDecimal buyInPrice;

    @Column(length = 30)
    private String status; // VALUATING, QUEUE, IN_AUCTION, etc.

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private ItemCategory category;

    @OneToMany
    @JoinColumn(name = "item_id")
    private List<AuctionItem> auctionItems;


}

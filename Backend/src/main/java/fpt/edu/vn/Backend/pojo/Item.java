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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_category_id") // This matches the column in the database
    private ItemCategory itemCategory;


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



    @OneToMany
    @JoinColumn(name = "item_id")
    private List<AuctionItem> auctionItems;


}

package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "bidId")
@Table(name = "auction_bid")
public class AuctionBid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private int bidId;

    @ManyToOne
    @JoinColumn(name = "bidder_id")
    private Account bidder;

    private BidType bidType;

    public AuctionBid(Account account, BidType bidType, BigDecimal i, AuctionItem auctionItem) {
        bidder = account;
        this.bidType = bidType;
        price = i;
        this.auctionItem = auctionItem;
        }

    public enum BidType {
        CHAT,
        JOIN,
        LEAVE
    }

    @Column(name = "price")
    private BigDecimal price;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @ManyToOne
    @JoinColumn(name = "auction_item_id")
    private AuctionItem auctionItem;

    public AuctionBid(BigDecimal price) {
        this.price = price;
    }
}

package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "auctionItemId")
@Table(name = "auction_item")
public class AuctionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_item_id")
    private int auctionItemId;

    @ManyToOne
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(name = "current_price")
    private BigDecimal currentPrice;

    @OneToMany

    @JoinColumn(name = "auction_item_id")
    private List<AuctionBid> auctionBids;
    // Consider adding currentPrice to track the highest bid during the auction
}

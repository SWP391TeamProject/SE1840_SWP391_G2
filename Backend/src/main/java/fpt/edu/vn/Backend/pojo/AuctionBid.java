package fpt.edu.vn.Backend.pojo;

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
public class AuctionBid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bidId;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "auction_id")
    private AuctionSession auctionSession; // Assuming this is AuctionSession

    @ManyToOne
    @JoinColumn(name = "bidder")
    private Account bidder;

    private BigDecimal price;

    @CreationTimestamp
    private LocalDateTime createDate;
}

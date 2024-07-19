package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
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
@Table(name = "auction_jewelry")
public class AuctionItem {
    @EmbeddedId
    private AuctionItemId auctionItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("auctionSessionId")
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("itemId")
    @JoinColumn(name = "jewelry_id")
    private Item item;

    @Column(name = "current_price", precision = 20, scale = 8)
    private BigDecimal currentPrice;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "auction_session_id", referencedColumnName = "auction_session_id"),
            @JoinColumn(name = "jewelry_id", referencedColumnName = "jewelry_id")
    })
    private Set<Bid> bids;

    @Column(name = "bid_count", columnDefinition = "int default 0", nullable = false)
    private int bidCount;

    @Column(name = "participant_count", columnDefinition = "int default 0", nullable = false)
    private int participantCount;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
}

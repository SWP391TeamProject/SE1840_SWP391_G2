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
@Table(name = "auction_item")
public class AuctionItem {
    @EmbeddedId
    private AuctionItemId auctionItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("auctionSessionId")
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(name = "current_price", precision = 20, scale = 8)
    private BigDecimal currentPrice;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
}

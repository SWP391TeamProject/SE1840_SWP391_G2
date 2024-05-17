package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionItem {
    @EmbeddedId
    private AuctionItemId id;

    @ManyToOne
    @MapsId("auctionSessionId")
    private AuctionSession auctionSession;

    @ManyToOne
    @MapsId("itemId")
    private Item item;

    private BigDecimal bidIncrement;
    private BigDecimal initialPrice;
    // Consider adding currentPrice to track the highest bid during the auction
}

package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class AuctionItemId implements Serializable {
    @Column(name = "auction_session_id")
    private Integer auctionSessionId;

    @Column(name = "item_id")
    private Integer itemId;
}

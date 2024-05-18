package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionBidKey implements Serializable {
    @Column(name = "auction_item_id")
    private int auctionItemId;

    @Column(name = "account_id")
    private int accountId;
}

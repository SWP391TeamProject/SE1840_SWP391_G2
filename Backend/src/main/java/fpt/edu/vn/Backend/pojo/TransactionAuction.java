package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionAuction {
    @Id
    private int transId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "trans_id")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
}

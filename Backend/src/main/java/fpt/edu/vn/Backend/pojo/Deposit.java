package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Deposit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int depositId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "auction_session_id", referencedColumnName = "auction_session_id"),
            @JoinColumn(name = "item_id", referencedColumnName = "item_id")
    })
    private AuctionItem auctionItem;

    @OneToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Override
    public int hashCode() {
        return depositId;
    }
}

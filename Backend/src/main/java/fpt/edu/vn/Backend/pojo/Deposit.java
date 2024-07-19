package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Deposit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id") // use transaction id as deposit id
    private int depositId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @OneToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "transaction_id")
    private Payment payment;

    @Override
    public int hashCode() {
        return depositId;
    }
}

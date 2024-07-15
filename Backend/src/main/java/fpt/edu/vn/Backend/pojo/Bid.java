package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bid")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "auction_session_id", referencedColumnName = "auction_session_id"),
            @JoinColumn(name = "item_id", referencedColumnName = "item_id")
    })
    private AuctionItem auctionItem;

    public enum Status {
        PENDING, SUCCESS, FAILED
    }
    private Status status;

    @Column(name = "amount", precision = 20, scale = 8)
    private BigDecimal amount;

    @CreationTimestamp
    private LocalDateTime createdDate;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;


    @Override
    public int hashCode() {
        return bidId;
    }
}

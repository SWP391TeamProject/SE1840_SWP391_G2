package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Deposit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int depositId;

    private int depositAmount;
    private String depositDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @OneToOne(mappedBy = "deposit")
    private Payment payment;

}

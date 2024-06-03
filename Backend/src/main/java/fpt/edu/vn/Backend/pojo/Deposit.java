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

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + depositId;
        result = prime * result + depositAmount;
        result = prime * result + (depositDate == null ? 0 : depositDate.hashCode());
        result = prime * result + (account == null ? 0 : account.hashCode());
        result = prime * result + (auctionSession == null ? 0 : auctionSession.hashCode());
        // exclude payment from hashCode calculation
        return result;
    }
}

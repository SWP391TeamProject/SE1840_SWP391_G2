package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepositRepos extends JpaRepository<Deposit,Integer> {
    @Query("SELECT COUNT(d) > 0 FROM Deposit d " +
            "JOIN d.payment p " +
            "WHERE d.auctionSession.auctionSessionId = :auctionSessionId " +
            "AND p.account.accountId = :accountId")
    boolean hasDeposited(int auctionSessionId, int accountId);
}

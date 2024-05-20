package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionBidRepos extends JpaRepository<Bid, Integer> {
    @Query("SELECT a FROM Bid a WHERE a.auctionItem.auctionItemId = ?1 ORDER BY a.price DESC")
    List<Bid> findAllBidByAuctionItemId(int auctionItemId);
}

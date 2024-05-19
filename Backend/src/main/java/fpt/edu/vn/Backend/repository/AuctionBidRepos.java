package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionBidRepos extends JpaRepository<AuctionBid, Integer> {
}

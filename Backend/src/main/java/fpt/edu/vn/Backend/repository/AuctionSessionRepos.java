package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionSessionRepos extends JpaRepository<AuctionSession, Integer> {
}

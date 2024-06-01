package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuctionSessionRepos extends JpaRepository<AuctionSession, Integer> {
    Page<AuctionSession> findByEndDateBefore(LocalDateTime endDate, Pageable pageable);
    Page<AuctionSession> findByStartDateAfter(LocalDateTime startDate, Pageable pageable);
}

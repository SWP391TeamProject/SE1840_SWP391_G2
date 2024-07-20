package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface AuctionSessionRepos extends JpaRepository<AuctionSession, Integer>, JpaSpecificationExecutor<AuctionSession> {
    @Query("""
           SELECT a FROM AuctionSession a
           WHERE (:status IS NULL OR a.status IN :status)
           AND (:search IS NULL OR (LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))))
           AND (:fromDate IS NULL OR (a.startDate >= :fromDate OR a.endDate >= :fromDate))
           AND (:toDate IS NULL OR (a.startDate <= :toDate OR a.endDate <= :toDate))
           """)
    Page<AuctionSession> findByCriteria(
            @Nullable @Param("status") Set<AuctionSession.Status> status,
            @Nullable @Param("search") String search,
            @Nullable @Param("fromDate") LocalDateTime fromDate,
            @Nullable @Param("toDate") LocalDateTime toDate,
            Pageable pageable);


    @Query("""
           SELECT a FROM AuctionSession a
           WHERE (:status IS NULL OR a.status IN :status)
           AND (:search IS NULL OR (LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))))
           AND (:fromDate IS NULL OR (a.startDate >= :fromDate OR a.endDate >= :fromDate))
           AND (:toDate IS NULL OR (a.startDate <= :toDate OR a.endDate <= :toDate))
           AND a.participantCount > 0
           """)
    Page<AuctionSession> findByCriteriaHasParticipant(
            @Nullable @Param("status") Set<AuctionSession.Status> status,
            @Nullable @Param("search") String search,
            @Nullable @Param("fromDate") LocalDateTime fromDate,
            @Nullable @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    @Query("SELECT a FROM AuctionSession a WHERE a.status = 'FINISHED'")
    List<AuctionSession> findFinishedAuctionSessionsByYear(int year);

    @Query("SELECT aj.auctionSession FROM AuctionItem aj WHERE aj.auctionItemId.itemId = :itemId ORDER BY aj.auctionSession.startDate DESC, aj.auctionSession.endDate DESC")
    Page<AuctionSession> findAuctionSessionsHasItem(int itemId, Pageable pageable);

    @Query("""
        SELECT auction FROM AuctionSession auction 
        WHERE auction.status <> 'TERMINATED' AND 
        ((:startDate BETWEEN auction.startDate AND auction.endDate) OR 
        (:endDate BETWEEN auction.startDate AND auction.endDate) OR 
        (auction.startDate BETWEEN :startDate AND :endDate) OR 
        (auction.endDate BETWEEN :startDate AND :endDate))
    """)
    AuctionSession getConflictingSession(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);
}

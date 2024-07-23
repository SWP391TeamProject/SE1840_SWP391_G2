package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuctionItemRepos extends JpaRepository<AuctionItem, AuctionItemId> {
    @Query("""
        SELECT ai FROM AuctionItem ai
        WHERE ai.item.itemId = :itemId
        ORDER BY ai.createDate DESC
        """)
    AuctionItem findLatestAuctionItemByItemId(@Param("itemId") Integer itemId);

    @Query("SELECT ai FROM AuctionItem ai WHERE ai.auctionItemId.itemId = :itemId ORDER BY ai.createDate DESC")
    List<AuctionItem> getLatestByItemId(@Param("itemId") Integer itemId);
}

package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionItemRepos extends JpaRepository<AuctionItem, AuctionItemId> {
}

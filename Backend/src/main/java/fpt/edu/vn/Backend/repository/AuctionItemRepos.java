package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionItemRepos extends JpaRepository<AuctionItem, Integer> {
}

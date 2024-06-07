package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface BidRepos extends JpaRepository<Bid, Integer> {
    List<Bid> findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(AuctionItemId auctionItemId);
    Page<Bid> findByPayment_Account_AccountId(int accountId, Pageable pageable);
}

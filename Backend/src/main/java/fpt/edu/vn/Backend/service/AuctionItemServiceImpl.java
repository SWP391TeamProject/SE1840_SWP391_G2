package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionItemServiceImpl implements AuctionItemService{
    @Autowired
    private AuctionItemRepos auctionItemRepos;

    @Override
    public List<AuctionItem> getAllAuctionItems() {
        return auctionItemRepos.findAll();
    }

    @Override
    public AuctionItem getAuctionItemById(int id) {
        return auctionItemRepos.findById(id).orElse(null);
    }
}

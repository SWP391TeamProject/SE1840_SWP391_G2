package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionItemServiceImpl implements AuctionItemService{
    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private AuctionSessionRepos auctionSessionRepos;
    @Autowired
    private ItemRepos itemRepos;

    @Override
    public List<AuctionItemDTO> getAllAuctionItems() {
        return auctionItemRepos.findAll().stream().map(AuctionItemDTO::new).toList();
    }

    @Override
    public AuctionItemDTO getAuctionItemById(int id) {
        return new AuctionItemDTO(auctionItemRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + id)
        ));
    }

    @Override
    public AuctionItemDTO createAuctionItem(AuctionItemDTO auctionItemDTO) {
        AuctionItem newAuctionItem = new AuctionItem();
        newAuctionItem.setAuctionSession(auctionSessionRepos.findById(auctionItemDTO.getAuctionSessionId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction session id: " + auctionItemDTO.getAuctionSessionId())
        ));
        newAuctionItem.setItem(itemRepos.findById(auctionItemDTO.getItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid item id: " + auctionItemDTO.getItemId())
        ));
        newAuctionItem.setCurrentPrice(auctionItemDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }

    @Override
    public AuctionItemDTO updateAuctionItem(AuctionItemDTO auctionItemDTO) {
        AuctionItem newAuctionItem = auctionItemRepos.findById(auctionItemDTO.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + auctionItemDTO.getAuctionItemId()));
        newAuctionItem.setAuctionSession(auctionSessionRepos.findById(auctionItemDTO.getAuctionSessionId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction session id: " + auctionItemDTO.getAuctionSessionId())
        ));
        newAuctionItem.setItem(itemRepos.findById(auctionItemDTO.getItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid item id: " + auctionItemDTO.getItemId())
        ));
        newAuctionItem.setCurrentPrice(auctionItemDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.request.AuctionItemRequestDTO;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
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
    public AuctionItemDTO getAuctionItemById(AuctionItemId id) {
        return new AuctionItemDTO(auctionItemRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + id)
        ));
    }

   @Override
    public AuctionItemDTO createAuctionItem(AuctionItemRequestDTO auctionItemRequestDTO) {
        AuctionItem newAuctionItem = new AuctionItem();
        newAuctionItem.setAuctionSession(auctionSessionRepos.findById(auctionItemRequestDTO.getAuctionSessionId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction session id: " + auctionItemRequestDTO.getAuctionSessionId())
        ));
        newAuctionItem.setItem(itemRepos.findById(auctionItemRequestDTO.getItemDTO().getItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid item id: " + auctionItemRequestDTO.getItemDTO())
        ));
        newAuctionItem.setCurrentPrice(auctionItemRequestDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }

    @Override
    public AuctionItemDTO updateAuctionItem(AuctionItemRequestDTO auctionItemRequestDTO) {
        AuctionItem newAuctionItem = auctionItemRepos.findById(auctionItemRequestDTO.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + auctionItemRequestDTO.getAuctionItemId()));
        newAuctionItem.setAuctionSession(auctionSessionRepos.findById(auctionItemRequestDTO.getAuctionSessionId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction session id: " + auctionItemRequestDTO.getAuctionSessionId())
        ));
        newAuctionItem.setItem(itemRepos.findById(auctionItemRequestDTO.getItemDTO().getItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid item id: " + auctionItemRequestDTO.getItemDTO())
        ));
        newAuctionItem.setCurrentPrice(auctionItemRequestDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }

    @Override
    public void deleteAuctionItem(int id) {
        if (!auctionItemRepos.existsById(id)) {
            throw new IllegalArgumentException("Invalid auction item id: " + id);
        }
        auctionItemRepos.deleteById(id);
    }


}

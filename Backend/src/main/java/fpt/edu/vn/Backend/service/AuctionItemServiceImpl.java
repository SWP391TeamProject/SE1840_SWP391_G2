package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionItemServiceImpl implements AuctionItemService {
    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private AuctionSessionRepos auctionSessionRepos;
    @Autowired
    private ItemRepos itemRepos;

    @Autowired
    private ItemService itemService;

    @Override
    public List<AuctionItemDTO> getAllAuctionItems() {
        return auctionItemRepos.findAll().stream().map(AuctionItemDTO::new).toList();
    }

    @Override
    public AuctionItemDTO getAuctionItemById(AuctionItemId id) {
        return new AuctionItemDTO(auctionItemRepos.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Invalid auction item id: " + id)
        ));
    }

    @Override
    @Transactional
    public AuctionItemDTO createAuctionItem(AuctionItemDTO auctionItemDTO) {
        AuctionItem newAuctionItem = new AuctionItem();
        newAuctionItem.setAuctionSession(auctionSessionRepos.findById(auctionItemDTO.getId().getAuctionSessionId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction session id: " + auctionItemDTO.getId().getAuctionSessionId())
        ));
        newAuctionItem.setItem(itemRepos.findById(auctionItemDTO.getId().getItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid item id: " + auctionItemDTO.getId().getItemId())
        ));
        newAuctionItem.setCurrentPrice(auctionItemDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }
    @Transactional
    @Override
    public AuctionItemDTO updateAuctionItem(AuctionItemDTO auctionItemDTO) {
        AuctionItem newAuctionItem = auctionItemRepos.findById(auctionItemDTO.getId()).orElseThrow(
                () -> new ResourceNotFoundException("Invalid auction item id: " + auctionItemDTO.getId()));
        newAuctionItem.setCurrentPrice(auctionItemDTO.getCurrentPrice());
        auctionItemRepos.save(newAuctionItem);
        return new AuctionItemDTO(newAuctionItem);

    }
    @Transactional
    @Override
    public void deleteById(AuctionItemId id) {
        if (!auctionItemRepos.existsById(id)) {
            throw new InvalidInputException("Invalid auction item id: " + id);
        }
        AuctionSession as = auctionSessionRepos.findById(id.getAuctionSessionId()).orElseThrow(
                () -> new ResourceNotFoundException("no auction session found with id :" + id.getAuctionSessionId()));
        if (!as.getStatus().equals(AuctionSession.Status.SCHEDULED)) {
            throw new InvalidInputException("Items can only be removed from auction sessions that are scheduled.");
        }

        Item item = itemRepos.findById(id.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("no item found with id :" + id.getItemId()));
        if (!item.getStatus().equals(Item.Status.IN_AUCTION)) {
            throw new InvalidInputException("""
                    item can't be removed from auction if it's not in auction
                    """);
        }
        item.setStatus(Item.Status.QUEUE);
        itemRepos.save(item);

        auctionItemRepos.deleteById(id);
    }
}

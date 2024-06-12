package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import fpt.edu.vn.Backend.service.AuctionItemServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)

public class AuctionItemServiceImplTest {
    @Mock
    AuctionItemRepos auctionItemRepos;

    @Mock
    AuctionSessionRepos auctionSessionRepos;

    @Mock
    ItemRepos itemRepos;

    @InjectMocks
    AuctionItemServiceImpl auctionItemService;

    @Test
    void getAllAuctionItems_HappyPath() {
        Item item = new Item();
        item.setItemId(1);
        item.setItemCategory(new ItemCategory());
        item.setOwner(new Account());
        item.setAttachments( Set.of());
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(new AuctionItemId(1, 1));
        auctionItem.setItem(item);

        when(auctionItemRepos.findAll()).thenReturn(List.of(auctionItem));

        assertFalse(auctionItemService.getAllAuctionItems().isEmpty());
    }

    @Test
    void getAuctionItemById_AuctionItemNotFound() {
        when(auctionItemRepos.findById(any())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionItemService.getAuctionItemById(new AuctionItemId()));
    }

    @Test
    void createAuctionItem_HappyPath() {
        Item item = new Item();
        item.setItemId(1);
        item.setItemCategory(new ItemCategory());
        item.setOwner(new Account());
        item.setAttachments( Set.of());
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(new AuctionItemId(1, 1));
        auctionItem.setItem(item);

        when(auctionSessionRepos.findById(any())).thenReturn(Optional.of(new AuctionSession()));
        when(itemRepos.findById(any())).thenReturn(Optional.of(item));
        when(auctionItemRepos.save(any())).thenReturn(auctionItem);

        AuctionItemDTO auctionItemDTO = new AuctionItemDTO();
        auctionItemDTO.setId(new AuctionItemId());
        auctionItemDTO.setCurrentPrice(BigDecimal.valueOf(100));

        assertNotNull(auctionItemService.createAuctionItem(auctionItemDTO));
    }

    @Test
    void createAuctionItem_InvalidAuctionSessionId() {
        when(auctionSessionRepos.findById(any())).thenReturn(Optional.empty());

        AuctionItemDTO auctionItemDTO = new AuctionItemDTO();
        auctionItemDTO.setId(new AuctionItemId());
        auctionItemDTO.setCurrentPrice(BigDecimal.valueOf(100));

        assertThrows(IllegalArgumentException.class, () -> auctionItemService.createAuctionItem(auctionItemDTO));
    }

    @Test
    void createAuctionItem_InvalidItemId() {
        when(auctionSessionRepos.findById(any())).thenReturn(Optional.of(new AuctionSession()));
        when(itemRepos.findById(any())).thenReturn(Optional.empty());

        AuctionItemDTO auctionItemDTO = new AuctionItemDTO();
        auctionItemDTO.setId(new AuctionItemId());
        auctionItemDTO.setCurrentPrice(BigDecimal.valueOf(100));

        assertThrows(IllegalArgumentException.class, () -> auctionItemService.createAuctionItem(auctionItemDTO));
    }

    @Test
    void updateAuctionItem_HappyPath() {
        Item item = new Item();
        item.setItemId(1);
        item.setItemCategory(new ItemCategory());
        item.setOwner(new Account());
        item.setAttachments( Set.of());
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(new AuctionItemId(1, 1));
        auctionItem.setItem(item);

        when(auctionItemRepos.findById(any())).thenReturn(Optional.of(auctionItem));
        when(auctionItemRepos.save(any())).thenReturn(new AuctionItem());

        AuctionItemDTO auctionItemDTO = new AuctionItemDTO();
        auctionItemDTO.setId(new AuctionItemId());
        auctionItemDTO.setCurrentPrice(BigDecimal.valueOf(100));

        assertNotNull(auctionItemService.updateAuctionItem(auctionItemDTO));
    }

    @Test
    void updateAuctionItem_AuctionItemNotFound() {
        when(auctionItemRepos.findById(any())).thenReturn(Optional.empty());

        AuctionItemDTO auctionItemDTO = new AuctionItemDTO();
        auctionItemDTO.setId(new AuctionItemId());
        auctionItemDTO.setCurrentPrice(BigDecimal.valueOf(100));

        assertThrows(ResourceNotFoundException.class, () -> auctionItemService.updateAuctionItem(auctionItemDTO));
    }

    @Test
    void deleteById_AuctionItemNotFound() {
        when(auctionItemRepos.existsById(any())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> auctionItemService.deleteById(new AuctionItemId()));
    }


}

package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.repository.ItemRepos;
import fpt.edu.vn.Backend.service.ItemServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ItemServiceImplTest {
    @Mock
    private ItemRepos itemRepos;

    @InjectMocks
    private ItemServiceImpl itemService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should return all items belonging to the owner when owner id is given")
    public void shouldReturnAllItemsBelongingToTheOwnerWhenOwnerIdIsGiven() {
        var account = new Account();
        account.setAccountId(1);

        var item1 = new Item();
        item1.setItemId(1);
        item1.setOwner(account);

        var item2 = new Item();
        item2.setItemId(2);
        item2.setOwner(account);

        var pr = PageRequest.of(0, 2);

        when(itemRepos.findItemByOwnerAccountId(1, pr))
                .thenReturn(new PageImpl<>(List.of(item1, item2)));

        assertEquals(2, itemService.getItemsByOwnerId(pr, 1).getContent().size());
    }

    @Test
    @DisplayName("Should return all items belonging to the category when category id is given")
    public void shouldReturnAllItemsBelongingToTheCategoryWhenCategoryIdIsGiven() {
        var itemCategory = new ItemCategory();
        itemCategory.setItemCategoryId(1);

        var item1 = new Item();
        item1.setItemId(1);
        item1.setItemCategory(itemCategory);

        var item2 = new Item();
        item2.setItemId(2);
        item2.setItemCategory(itemCategory);

        var pr = PageRequest.of(0, 2);

        when(itemRepos.findItemByItemCategoryItemCategoryId(1, pr))
                .thenReturn(new PageImpl<>(List.of(item1, item2)));

        assertEquals(2, itemService.getItemsByCategoryId(pr, 1).getContent().size());
    }

    @Test
    @DisplayName("Should return all items with given status when status is given")
    public void shouldReturnAllItemsWithGivenStatusWhenStatusIsGiven() {
        var item1 = new Item();
        item1.setItemId(1);
        item1.setStatus(Item.Status.QUEUE);

        var item2 = new Item();
        item2.setItemId(2);
        item2.setStatus(Item.Status.SOLD);

        var pr = PageRequest.of(0, 2);

        when(itemRepos.findItemByStatus(Item.Status.QUEUE, pr))
                .thenReturn(new PageImpl<>(List.of(item1)));

        when(itemRepos.findItemByStatus(Item.Status.SOLD, pr))
                .thenReturn(new PageImpl<>(List.of(item2)));

        assertEquals(1, itemService.getItemsByStatus(pr, Item.Status.QUEUE).getContent().size());
        assertEquals(1, itemService.getItemsByStatus(pr, Item.Status.SOLD).getContent().size());
    }

    @Test
    @DisplayName("Should return correct item when item id is given")
    public void shouldReturnCorrectItemWhenItemIdIsGiven() {
        var item = new Item();
        item.setItemId(1);
        when(itemRepos.findById(1)).thenReturn(Optional.of(item));
        var itemDTO = itemService.mapEntityToDTO(item);
        assertEquals(itemDTO, itemService.getItemById(1));
    }

    @Test
    @DisplayName("Should update item when item details is given")
    public void shouldUpdateItemWhenItemDetailsIsGiven() {
        var item = new Item();
        item.setItemId(1);
        item.setName("KFC Chicken");
        item.setDescription("The best chicken");

        when(itemRepos.findById(1)).thenReturn(Optional.of(item));
        when(itemRepos.save(item)).thenReturn(item);

        var itemDTO = new ItemDTO();
        itemDTO.setItemId(1);
        itemDTO.setName("FPT Chicken");

        var expected = new ItemDTO();
        expected.setItemId(1);
        expected.setName("FPT Chicken");
        expected.setDescription("The best chicken");

        assertEquals(expected, itemService.updateItem(itemDTO));
    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.ItemServiceException;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements IItemService {

    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    private ItemRepos itemRepos;

    @Autowired
    private ItemCategoryRepos itemCategoryRepos;

    @Override
    public ItemDTO createItem(ItemDTO itemDTO) {
        try {
            // Create an Item entity from the DTO
            Item item = new Item();
            item.setName(itemDTO.getName());
            item.setDescription(itemDTO.getDescription());
            item.setReservePrice(itemDTO.getReservePrice());
            item.setBuyInPrice(itemDTO.getBuyInPrice());
            item.setStatus(Item.itemStatus.valueOf(itemDTO.getStatus()));
            item.setCreateDate(itemDTO.getCreateDate());
            item.setUpdateDate(itemDTO.getUpdateDate());

            // Set the ItemCategory
            ItemCategory category = itemCategoryRepos.findById(itemDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setItemCategory(category);

            // Save the item to the database
            Item savedItem = itemRepos.save(item);

            // Create and return the updated ItemDTO
            return new ItemDTO(savedItem);
        } catch (Exception e){
            throw new ItemServiceException("Error creating item ",e);
        }
    }

    @Override
    public ItemDTO getItemById(int id) {
        return null;
    }

    @Override
    public ItemDTO updateItem(ItemDTO item) {
        return null;
    }

    @Override
    public void deleteItem(int id) {

    }

    @Override
    public List<ItemDTO> getAllItems() {
        return List.of();
    }

    @Override
    public List<ItemDTO> getItemsByStatus(String status) {
        return List.of();
    }

    @Override
    public List<ItemDTO> getItemsByOwnerId(int ownerId) {
        try {
            List<Item> items = accountRepos.findById(ownerId).orElseThrow().getItems();
            return items.stream().map(ItemDTO::new).toList();
        } catch (Exception e) {
            throw new ItemServiceException("Owner not found");
        }
    }

    @Override
    public List<ItemDTO> getItemsByCategoryId(int categoryId) {
        try {

            return itemRepos.findItemByItemCategory(itemCategoryRepos.findById(categoryId).orElseThrow()).stream().map(ItemDTO::new).toList();
        } catch (Exception e) {
            throw new ItemServiceException("Category not found");
        }
    }
}

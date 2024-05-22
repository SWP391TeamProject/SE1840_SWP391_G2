package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.ItemServiceException;

import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
pojo.Item;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements IItemService {

    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    private ItemRepos itemRepos;

    @Autowired
    private ItemCategoryRepos itemCategoryRepos;


    @Autowired
    public ItemServiceImpl (ItemRepos itemRepos){
        this.itemRepos = itemRepos;
    }


    @Override
    public ItemDTO createItem(ItemDTO item) {
        return null;
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
        try {
            List<Item> items = itemRepos.findAll();
            return items.stream()
                    .map(ItemDTO::new)
                    .collect(Collectors.toList());
        }catch(Exception e){
            throw new ItemServiceException("Failed to retrieve items", e);
        }
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
        return null;

        try {

            return itemRepos.findItemByItemCategory(itemCategoryRepos.findById(categoryId).orElseThrow()).stream().map(ItemDTO::new).toList();
        } catch (Exception e) {
            throw new ItemServiceException("Category not found");
        }
    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.pojo.Item;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements IItemService {


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
        return List.of();
    }

    @Override
    public List<ItemDTO> getItemsByStatus(String status) {
        return List.of();
    }

    @Override
    public List<ItemDTO> getItemsByOwnerId(int ownerId) {
        return List.of();
    }

    @Override
    public List<ItemDTO> getItemsByCategoryId(int categoryId) {
        return List.of();
    }
}

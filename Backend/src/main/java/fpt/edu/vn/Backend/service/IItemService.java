package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.pojo.Item;

import java.util.List;

public interface IItemService {


    ItemDTO createItem(ItemDTO itemDTO);
    ItemDTO getItemById(int id);
    ItemDTO updateItem(ItemDTO itemDTO);
    void deleteItem(int id);
    List<ItemDTO> getAllItems();
    List<ItemDTO> getItemsByStatus(String status);
    List<ItemDTO> getItemsByOwnerId(int ownerId);
    List<ItemDTO> getItemsByCategoryId(int categoryId);




}

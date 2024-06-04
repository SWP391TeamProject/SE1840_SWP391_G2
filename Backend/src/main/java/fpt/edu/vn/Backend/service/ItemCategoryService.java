package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ItemCategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface ItemCategoryService {
    ItemCategoryDTO createItemCategory(ItemCategoryDTO itemCategoryDTO);
    ItemCategoryDTO updateItemCategory(ItemCategoryDTO itemCategoryDTO);
    ResponseEntity<ItemCategoryDTO> deleteItemCategory(int id);
    ItemCategoryDTO getItemCategoryById(int id);
    Page<ItemCategoryDTO> getAllItemCategories(Pageable pageable);

}

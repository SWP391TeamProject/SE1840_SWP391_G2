package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemCategoryDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ItemCategoryImpl implements ItemCategoryService{
    @Autowired
    private ItemCategoryRepos itemCategoryRepos;


    @Override
    public ItemCategoryDTO createItemCategory(ItemCategoryDTO itemCategoryDTO) {
        ItemCategory itemCategory = new ItemCategory();
        itemCategory.setName(itemCategoryDTO.getName());
        itemCategory.setCreateDate(LocalDateTime.now());
        itemCategory.setUpdateDate(LocalDateTime.now());

        ItemCategory savedItemCategory = itemCategoryRepos.save(itemCategory);
        return new ItemCategoryDTO(savedItemCategory);
    }

    @Override
    public ItemCategoryDTO updateItemCategory(ItemCategoryDTO itemCategoryDTO) {
        Optional<ItemCategory> optionalItemCategory = itemCategoryRepos.findById(itemCategoryDTO.getItemCategoryId());
        if (optionalItemCategory.isPresent()) {
            ItemCategory itemCategory = optionalItemCategory.get();
            itemCategory.setName(itemCategoryDTO.getName());
            itemCategory.setUpdateDate(LocalDateTime.now());

            ItemCategory updatedItemCategory = itemCategoryRepos.save(itemCategory);
            return new ItemCategoryDTO(updatedItemCategory);
        } else {
            // Handle item category not found
            throw new ResourceNotFoundException("ItemCategory not found with id " + itemCategoryDTO.getItemCategoryId());
        }
    }

    @Override
    public ResponseEntity<ItemCategoryDTO> deleteItemCategory(int id) {
        if (itemCategoryRepos.existsById(id)) {
            itemCategoryRepos.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            // Handle item category not found
            throw new ResourceNotFoundException("ItemCategory not found with id " + id);
        }
    }

    @Override
    public ItemCategoryDTO getItemCategoryById(int id) {
        Optional<ItemCategory> optionalItemCategory = itemCategoryRepos.findById(id);
        if (optionalItemCategory.isPresent()) {
            return new ItemCategoryDTO(optionalItemCategory.get());
        } else {
            // Handle item category not found
            throw new ResourceNotFoundException("ItemCategory not found with id " + id);
        }
    }

    @Override
    public Page<ItemCategoryDTO> getAllItemCategories(Pageable pageable) {
        Page<ItemCategory> itemCategoryPage = itemCategoryRepos.findAll(pageable);
        return itemCategoryPage.map(ItemCategoryDTO::new);
    }
}


package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemCategoryDTO;
import fpt.edu.vn.Backend.DTO.request.ItemCategoryRequestDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ItemCategoryServiceImpl implements ItemCategoryService {
    @Autowired
    private ItemCategoryRepos itemCategoryRepos;


    @Override
    @CacheEvict(value = "itemCategory",allEntries = true)
    public ItemCategoryDTO createItemCategory(ItemCategoryRequestDTO itemCategoryRequestDTO) {
        ItemCategory itemCategory = new ItemCategory();
        itemCategory.setName(itemCategoryRequestDTO.getName());
        itemCategory.setCreateDate(LocalDateTime.now());
        itemCategory.setUpdateDate(LocalDateTime.now());
        if (itemCategoryRepos.findByName(itemCategory.getName()) != null) {
            throw new ResourceNotFoundException("ItemCategory already exists with name " + itemCategory.getName());
        }
        ItemCategory savedItemCategory = itemCategoryRepos.save(itemCategory);
        return new ItemCategoryDTO(savedItemCategory);
    }

    @Override
    @CacheEvict(value = "itemCategory",allEntries = true)
    public ItemCategoryDTO updateItemCategory(ItemCategoryRequestDTO itemCategoryRequestDTO) {
        Optional<ItemCategory> optionalItemCategory = itemCategoryRepos.findById(itemCategoryRequestDTO.getItemCategoryId());
        if (optionalItemCategory.isPresent()) {
            ItemCategory itemCategory = optionalItemCategory.get();
            itemCategory.setName(itemCategoryRequestDTO.getName());
            itemCategory.setUpdateDate(LocalDateTime.now());

            ItemCategory updatedItemCategory = itemCategoryRepos.save(itemCategory);
            return new ItemCategoryDTO(updatedItemCategory);
        } else {
            // Handle item category not found
            throw new ResourceNotFoundException("ItemCategory not found with id " + itemCategoryRequestDTO.getItemCategoryId());
        }
    }

    @Override
    @CacheEvict(key = "#id", value = "itemCategory")
    public ResponseEntity<ItemCategoryDTO> deleteItemCategory(int id) {
        if (itemCategoryRepos.findItemCategoryByItemCategoryId(id).getItems() != null
                && !itemCategoryRepos.findItemCategoryByItemCategoryId(id).getItems().isEmpty()) {
            throw new ResourceNotFoundException("ItemCategory has items");
        }
        if (itemCategoryRepos.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("ItemCategory not found with id " + id);
        }
        itemCategoryRepos.deleteById(id);
        return ResponseEntity.ok().build();

    }

    @Override
    @Cacheable(key = "#id", value = "itemCategory")
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
    @Cacheable(key = "#pageable", value = "itemCategory")
    public Page<ItemCategoryDTO> getAllItemCategories(Pageable pageable) {
        Page<ItemCategory> itemCategoryPage = itemCategoryRepos.findAll(pageable);
        return itemCategoryPage.map(ItemCategoryDTO::new);
    }
}


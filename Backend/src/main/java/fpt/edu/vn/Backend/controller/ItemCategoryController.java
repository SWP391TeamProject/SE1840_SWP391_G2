package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ItemCategoryDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.service.ItemCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/item-categories")
@CrossOrigin("*")
public class ItemCategoryController {

    private final ItemCategoryService itemCategoryService;

    @Autowired
    public ItemCategoryController(ItemCategoryService itemCategoryService) {
        this.itemCategoryService = itemCategoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<ItemCategoryDTO> createItemCategory(@RequestBody ItemCategoryDTO itemCategoryDTO) {
        ItemCategoryDTO createdItemCategory = itemCategoryService.createItemCategory(itemCategoryDTO);
        return ResponseEntity.ok(createdItemCategory);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ItemCategoryDTO> updateItemCategory(
            @PathVariable int id,
            @RequestBody ItemCategoryDTO itemCategoryDTO) {
        itemCategoryDTO.setItemCategoryId(id);
        ItemCategoryDTO updatedItemCategory = itemCategoryService.updateItemCategory(itemCategoryDTO);
        return ResponseEntity.ok(updatedItemCategory);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteItemCategory(@PathVariable int id) {
        itemCategoryService.deleteItemCategory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemCategoryDTO> getItemCategoryById(@PathVariable int id) {
        ItemCategoryDTO itemCategory = itemCategoryService.getItemCategoryById(id);
        return ResponseEntity.ok(itemCategory);
    }

    @GetMapping("/")
    public ResponseEntity<Page<ItemCategoryDTO>> getAllItemCategories(Pageable pageable) {
        Page<ItemCategoryDTO> itemCategories = itemCategoryService.getAllItemCategories(pageable);
        return ResponseEntity.ok(itemCategories);
    }
}
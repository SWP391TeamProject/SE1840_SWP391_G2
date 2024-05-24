package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/")
    public Page<ItemDTO> getItems(Pageable pageable) {
        return itemService.getItems(pageable);
    }

    @GetMapping("/category/{categoryId}")
    public Page<ItemDTO> getItemsByCategoryId(
            @PathVariable int categoryId,
            @PageableDefault(size = 30) Pageable pageable) {
        return itemService.getItemsByCategoryId(pageable, categoryId);
    }

    @GetMapping("/status/{status}")
    public Page<ItemDTO> getItemsByStatus(
            @PathVariable Item.Status status,
            @PageableDefault(size = 30) Pageable pageable) {
        return itemService.getItemsByStatus(pageable, status);
    }

    @GetMapping("/owner/{ownerId}")
    public Page<ItemDTO> getItemsByOwnerId(
            @PathVariable int ownerId,
            @PageableDefault(size = 30) Pageable pageable) {
        return itemService.getItemsByOwnerId(pageable, ownerId);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable int id) {
        return new ResponseEntity<>(itemService.getItemById(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemDTO itemDTO) {
        return new ResponseEntity<>(itemService.createItem(itemDTO), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<ItemDTO> updateItem(@RequestBody ItemDTO itemDTO) {
        if (itemDTO.getItemId() == null) {
            throw new InvalidInputException("Item id cannot be null");
        }
        return new ResponseEntity<>(itemService.updateItem(itemDTO), HttpStatus.OK);
    }
}

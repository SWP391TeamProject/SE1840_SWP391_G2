package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.service.IItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    IItemService itemService;

    public ItemController(IItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/")
    public ResponseEntity<ItemDTO> getALlItems() {
        return new ResponseEntity( itemService.getAllItems(), HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ItemDTO>> getItemsByCategoryId(@PathVariable int categoryId) {
        return new ResponseEntity<>(itemService.getItemsByCategoryId(categoryId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(int id) {
        return new ResponseEntity<>(itemService.getItemById(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ItemDTO> createItem(ItemDTO itemDTO) {
        return new ResponseEntity<>(itemService.createItem(itemDTO), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<ItemDTO> updateItem(ItemDTO itemDTO) {
        return new ResponseEntity<>(itemService.updateItem(itemDTO), HttpStatus.OK);
    }
}

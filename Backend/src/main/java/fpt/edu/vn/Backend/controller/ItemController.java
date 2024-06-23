package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.CreateItemRequestDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exporter.AccountExporter;
import fpt.edu.vn.Backend.exporter.ItemExporter;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.service.ItemService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin("*")
public class ItemController {
    private static final Logger log = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/")
    public Page<ItemDTO> getItems(@PageableDefault(size = 50,sort = "createDate") Pageable pageable ,
                                  @RequestParam(required = false) Integer minPrice, @RequestParam(required = false) Integer maxPrice,
                                  @RequestParam(required = false) String order){
        if(order != null){
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (minPrice != null && maxPrice != null) {
            return itemService.getItemsByPrice(pageable, minPrice, maxPrice);
        }else {
            return itemService.getItemsByStatus(pageable, Item.Status.IN_AUCTION);
        }
    }

    @GetMapping("/category/{categoryId}")
    public Page<ItemDTO> getItemsByCategoryId(
            @PathVariable int categoryId,
            @PageableDefault(size = 30,sort = "createDate") Pageable pageable,
            @RequestParam(required = false) Integer minPrice, @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String order){
        log.info("page: " + pageable.getPageNumber() + " size: " + pageable.getPageSize() + " sort: " + pageable.getSort());
        if(order != null){
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (minPrice != null && maxPrice != null) {
            log.info("minPrice: " + minPrice + " maxPrice: " + maxPrice);
            return itemService.getItemsByCategoryIdByPrice(pageable, categoryId, minPrice, maxPrice);
        }else {
            log.info("categoryId: " + categoryId);
            return itemService.getItemsByCategoryId(pageable, categoryId);
        }
    }

    @GetMapping("/search/{name}")
    public Page<ItemDTO> getItemsByName(
            @PathVariable String name,
            @PageableDefault(size = 30,sort = "createDate") Pageable pageable,
            @RequestParam(required = false) String order) {
        if(order != null){
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        return itemService.getItemsByName(pageable, name);
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
    public ResponseEntity<ItemDTO> createItem(@ModelAttribute CreateItemRequestDTO itemDTO) throws IOException {

        if (itemDTO.getFiles() != null) {
            for (MultipartFile f : itemDTO.getFiles()) {
                if (f.getSize() > 10000000) {
                    throw new InvalidInputException("File size must be less than 10MB");
                }

            }
        }else {
            throw new InvalidInputException("File cannot be null");
        }
        return new ResponseEntity<>(itemService.createItem(itemDTO), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<ItemDTO> updateItem(@RequestBody ItemDTO itemDTO) {
        if (itemDTO.getItemId() == null) {
            throw new InvalidInputException("Item id cannot be null");
        }
        return new ResponseEntity<>(itemService.updateItem(itemDTO), HttpStatus.OK);
    }
    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response){
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=accounts_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);
        Pageable pageable = Pageable.unpaged();
        List<ItemDTO> listItems = itemService.getItems(pageable).getContent();

        ItemExporter excelExporter = new ItemExporter(listItems);

        excelExporter.export(response);
    }
}

package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.CreateItemRequestDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateItemStatusRequestDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.exporter.ItemExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import fpt.edu.vn.Backend.service.ItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
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
    private final ConsignmentService consignmentService;
    private final AccountService accountService;

    @Autowired
    public ItemController(ItemService itemService, ConsignmentService consignmentService, AccountService accountService) {
        this.itemService = itemService;
        this.consignmentService = consignmentService;
        this.accountService = accountService;
    }


    @GetMapping("/")
    public Page<ItemDTO> getItems( @PageableDefault Pageable pageable,
                                  @RequestParam(required = false) Integer minPrice, @RequestParam(required = false) Integer maxPrice,
                                  @RequestParam(required = false) String order, @RequestParam(required = false) String status) {
        System.out.println("Pageable: " + pageable.toString());
        if (order != null) {
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (minPrice != null && maxPrice != null) {
            return itemService.getItemsByPrice(pageable, minPrice, maxPrice);
        } else {
            if (status != null) {
                return itemService.getItemsByStatus(pageable, Item.Status.valueOf(status.toUpperCase()));
            }
            return itemService.getItems(pageable);
        }
    }

    @GetMapping("/category/{categoryId}")
    public Page<ItemDTO> getItemsByCategoryId(
            @PathVariable int categoryId,
            @PageableDefault(size = 30, sort = "createDate") Pageable pageable,
            @RequestParam(required = false) Integer minPrice, @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) String status) {
        if (order != null) {
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (minPrice != null && maxPrice != null) {
            return itemService.getItemsByCategoryIdByPrice(pageable, categoryId, minPrice, maxPrice);
        } else {
            if (status == null) {
                return itemService.getItemsByCategoryId(pageable, categoryId);
            }
            return itemService.getItemsByCategoryId(pageable, categoryId, Item.Status.valueOf(status.toUpperCase()));
        }
    }

    @GetMapping("/search/{name}")
    public Page<ItemDTO> getItemsByName(
            @PathVariable String name,
            @PageableDefault(size = 30, sort = "createDate") Pageable pageable,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) String status) {
        if (order != null) {
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (status != null) {
            return itemService.getItemsByName(pageable, name, Item.Status.valueOf(status.toUpperCase()));
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
        if (itemDTO.getName() == null || itemDTO.getName().isEmpty()) {
            throw new InvalidInputException("Item name cannot be null");
        }
        if (itemDTO.getReservePrice() < 0 || itemDTO.getBuyInPrice() < 0) {
            throw new InvalidInputException("Item price cannot be negative");
        }
        if (itemDTO.getReservePrice() > itemDTO.getBuyInPrice()) {
            throw new InvalidInputException("Reserve price must be smaller than buy in price");
        }
        if (itemDTO.getFiles() != null) {
            for (MultipartFile f : itemDTO.getFiles()) {
                if (f.getSize() > 10000000) {
                    throw new InvalidInputException("File size must be less than 10MB");
                }
            }
        } else {
            throw new InvalidInputException("File cannot be null");
        }
        return new ResponseEntity<>(itemService.createItem(itemDTO), HttpStatus.CREATED);
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<ItemDTO> createItemFromConsignment(@ModelAttribute CreateItemRequestDTO itemDTO, @PathVariable int id) throws IOException {
        ConsignmentDTO consignmentDTO = consignmentService.getConsignmentById(id);
        BigDecimal reservePrice = consignmentDTO.getConsignmentDetails().stream()
                .filter(
                        consignmentDetailDTO -> consignmentDetailDTO.getStatus()
                                .equalsIgnoreCase(String.valueOf(ConsignmentDetail.ConsignmentType.MANAGER_ACCEPTED))
                ).toList().get(0).getPrice();
        if(reservePrice==null){
            throw new ResourceNotFoundException("This consignment doesn't have manager accepted evaluation!");
        }
        if (reservePrice.compareTo(BigDecimal.valueOf(itemDTO.getReservePrice())) != 0) {
            throw new InvalidInputException("You can't change reserve price!");
        }
        if (itemDTO.getName() == null || itemDTO.getName().isEmpty()) {
            throw new InvalidInputException("Item name cannot be null");
        }
        if (itemDTO.getReservePrice() < 0 || itemDTO.getBuyInPrice() < 0) {
            throw new InvalidInputException("Item price cannot be negative");
        }
        if (itemDTO.getReservePrice() > itemDTO.getBuyInPrice()) {
            throw new InvalidInputException("Reserve price must be smaller than buy in price");
        }
        if (itemDTO.getFiles() != null) {
            for (MultipartFile f : itemDTO.getFiles()) {
                if (f.getSize() > 10000000) {
                    throw new InvalidInputException("File size must be less than 10MB");
                }
            }
        } else {
            throw new InvalidInputException("File cannot be null");
        }
        consignmentDTO.setStatus(String.valueOf(Consignment.Status.FINISHED));
        consignmentService.updateConsignment(consignmentDTO.getConsignmentId(),consignmentDTO);
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
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication){
         AccountDTO account = accountService.getAccountByEmail(authentication.getName());
          if (account == null || account.getRole() != Account.Role.ADMIN) {
                throw new InvalidInputException("You are not authorized to perform this action");
          }
          List<ItemDTO> listItems;
          {
                listItems = itemService.getItems(PageRequest.of(0, 1000)).getContent();
          }

          DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
          String currentDateTime = dateFormatter.format(new Date());

          String headerValue = "filename=items_" + currentDateTime + ".xlsx";

          ItemExporter excelExporter = new ItemExporter(listItems);

          ByteArrayOutputStream stream = excelExporter.export();

          HttpHeaders headers = new HttpHeaders();
          headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
          headers.setContentDispositionFormData("attachment", headerValue);

          return ResponseEntity.ok()
                 .headers(headers)
                 .body(stream.toByteArray());
     }


    @PostMapping("/updateStatus")
    public ResponseEntity<Void> updateItemStatus(@RequestBody(required = false) UpdateItemStatusRequestDTO itemDTOList) {
        itemService.updateItemByStatus(itemDTOList);
        return ResponseEntity.ok().build();
    }
}

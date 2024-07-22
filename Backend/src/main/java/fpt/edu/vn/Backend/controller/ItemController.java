package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.request.AttachmentUploadDTO;
import fpt.edu.vn.Backend.DTO.request.ItemUpdateDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.exporter.ItemExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.JwtUser;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
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
    public Page<ItemDTO> getItems(
            Principal principal,
            @PageableDefault Pageable pageable,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Item.Status status,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search
    ) {
        JwtUser jwtUser = Authorizer.getUser(principal);
        if (jwtUser == null || !Authorizer.MANAGER.contains(jwtUser.getRole())) {
            if (status == Item.Status.REMOVED)
                status = null;
        }
        return itemService.getItems(pageable, minPrice, maxPrice, status, categoryId, search);
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

    @GetMapping("/inventory")
    public Page<ItemDTO> getInventory(Principal principal, @PageableDefault(size = 30) Pageable pageable) {
        JwtUser jwtUser = Authorizer.requireUser(principal);
        return itemService.getItemsByBuyerId(pageable, jwtUser.getUserId());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable int id) {
        return new ResponseEntity<>(itemService.getItemById(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemUpdateDTO itemDTO) throws IOException {
        if (itemDTO.getConsignmentId() != null) {
            ConsignmentDTO consignmentDTO = consignmentService.getConsignmentById(itemDTO.getConsignmentId());
            BigDecimal reservePrice = consignmentDTO.getConsignmentDetails().stream()
                    .filter(
                            consignmentDetailDTO -> consignmentDetailDTO.getStatus()
                                    .equalsIgnoreCase(String.valueOf(ConsignmentDetail.ConsignmentType.MANAGER_ACCEPTED))
                    ).findFirst().map(ConsignmentDetailDTO::getPrice).orElse(null);
            if (reservePrice == null) {
                throw new ResourceNotFoundException("This consignment doesn't have manager accepted evaluation!");
            }
            consignmentService.updateConsignment(consignmentDTO.getConsignmentId(), consignmentDTO);
        }
        return new ResponseEntity<>(itemService.createItem(itemDTO), HttpStatus.CREATED);
    }

    @PostMapping("/update")
    public ResponseEntity<ItemDTO> updateItem(@RequestBody ItemUpdateDTO itemDTO) {
        return new ResponseEntity<>(itemService.updateItem(itemDTO), HttpStatus.OK);
    }

    @PutMapping("/attachment/{id}")
    public ResponseEntity<List<AttachmentDTO>> uploadItemAttachment(@PathVariable int id,
                                                                    @ModelAttribute AttachmentUploadDTO dto) {
        try {
            return new ResponseEntity<>(itemService.uploadAttachment(id, dto), HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload item attachment", e);
        }
    }

    @DeleteMapping("/attachment/{item}/{attachment}")
    public ResponseEntity<ItemDTO> deleteItemAttachment(@PathVariable int item,
                                                        @PathVariable int attachment) {
        itemService.deleteAttachment(attachment, item);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication){
         AccountDTO account = accountService.getAccountByEmail(authentication.getName());
          if (account == null || account.getRole() != Account.Role.ADMIN) {
                throw new InvalidInputException("You are not authorized to perform this action");
          }
          List<ItemDTO> listItems;
          {
                listItems = itemService.getItems(PageRequest.of(0, 1000),
                        null, null, null, null, null).getContent();
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
}

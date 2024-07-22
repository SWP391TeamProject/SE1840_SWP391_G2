package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.AttachmentUploadDTO;
import fpt.edu.vn.Backend.DTO.request.ItemUpdateDTO;
import fpt.edu.vn.Backend.exception.MappingException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service
//@CacheConfig (cacheNames = "item")
public class ItemServiceImpl implements ItemService {
    private static final Map<Item.Status, Set<Item.Status>> VALID_TRANSITIONS = Map.of(
            Item.Status.QUEUE, Set.of(
                    Item.Status.QUEUE,
                    Item.Status.REMOVED
            ),
            Item.Status.IN_AUCTION, Set.of(
                    Item.Status.IN_AUCTION
            ),
            Item.Status.SOLD, Set.of(
                    Item.Status.SOLD
            ),
            Item.Status.REMOVED, Set.of(
                    Item.Status.REMOVED
            )
    );
    private final AccountRepos accountRepos;
    private final ItemRepos itemRepos;
    private final ItemCategoryRepos itemCategoryRepos;

    private final AttachmentService attachmentService;

    @Autowired
    public ItemServiceImpl(AccountRepos accountRepos,
                           ItemRepos itemRepos,
                           ItemCategoryRepos itemCategoryRepos,
                           AttachmentService attachmentService) {
        this.accountRepos = accountRepos;
        this.itemRepos = itemRepos;
        this.itemCategoryRepos = itemCategoryRepos;
        this.attachmentService = attachmentService;
    }
    
    @Override
    public @NotNull Item mapDTOToEntity(@NotNull ItemUpdateDTO itemDTO, @NotNull Item item) {
        item.setItemId(itemDTO.getItemId());
        if (itemDTO.getCategoryId() != null)
            item.setItemCategory(itemCategoryRepos.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new MappingException("Category not found: " + itemDTO.getCategoryId())));
        if (itemDTO.getName() != null)
            item.setName(itemDTO.getName());
        if (itemDTO.getDescription() != null)
            item.setDescription(itemDTO.getDescription());
        if (itemDTO.getReservePrice() != null) {
            Preconditions.checkState(itemDTO.getReservePrice().signum() >= 0,
                    "Reserve price must not be negative");
            item.setReservePrice(itemDTO.getReservePrice());
        }
        if (itemDTO.getBuyInPrice() != null) {
            Preconditions.checkState(itemDTO.getBuyInPrice().signum() >= 0,
                    "Buy-in price must not be negative");
            item.setBuyInPrice(itemDTO.getBuyInPrice());
        }
        if (itemDTO.getStatus() != null)
            item.setStatus(itemDTO.getStatus());
        if (itemDTO.getOwnerId() != null)
            item.setOwner(accountRepos.findById(itemDTO.getOwnerId())
                .orElseThrow(() -> new MappingException("Account not found: " + itemDTO.getOwnerId())));
        if (itemDTO.getColor() != null)
            item.setColor(itemDTO.getColor());
        if (itemDTO.getWeight() != null)
            item.setWeight(Double.parseDouble(itemDTO.getWeight()));
        if (itemDTO.getMeasurement() != null)
            item.setMeasurement(itemDTO.getMeasurement());
        if(itemDTO.getMetal() != null)
            item.setMetal(itemDTO.getMetal());
        if(itemDTO.getCondition() != null)
            item.setCondition(itemDTO.getCondition());
        if(itemDTO.getStamped() != null)
            item.setStamped(itemDTO.getStamped());
        if(itemDTO.getGemstone() != null)
            item.setGemstone(itemDTO.getGemstone());
        // DO NOT CHANGE ORDER
//        if (itemDTO.getOrderId() != null)
//            item.setOrder(itemDTO.getOrderId());
        return item;
    }
    
    @Override
    //@CacheEvict(value = "item", allEntries = true, beforeInvocation = true)
    public @NotNull ItemDTO createItem(@NotNull ItemUpdateDTO requestDTO) throws IOException {
        requestDTO.setStatus(Item.Status.QUEUE); // always QUEUE
        requestDTO.setItemId(null); // always create new item
        Preconditions.checkNotNull(requestDTO.getReservePrice(), "Reserve price must not be null");
        Preconditions.checkNotNull(requestDTO.getBuyInPrice(), "Buy-in price must not be null");
        Preconditions.checkNotNull(requestDTO.getName(), "Name must not be null");
        Preconditions.checkNotNull(requestDTO.getDescription(), "Description must not be null");
        Preconditions.checkNotNull(requestDTO.getCategoryId(), "CategoryId must not be null");
        Preconditions.checkNotNull(requestDTO.getOwnerId(), "OwnerId must not be null");
        Preconditions.checkNotNull(requestDTO.getGemstone(), "Gemstone must not be null");
        Preconditions.checkNotNull(requestDTO.getCondition(), "Condition must not be null");
        Preconditions.checkNotNull(requestDTO.getMeasurement(), "Measurement must not be null");
        Preconditions.checkNotNull(requestDTO.getStamped(), "Stamped must not be null");
        Preconditions.checkNotNull(requestDTO.getMetal(), "Metal must not be null");
        Preconditions.checkNotNull(requestDTO.getWeight(), "Weight must not be null");
        Item savedItem = itemRepos.save(mapDTOToEntity(requestDTO, new Item()));
        return new ItemDTO(savedItem);
    }

    @Override
   //@Cacheable(value = "item", key = "#id")
    public ItemDTO getItemById(int id) {
        return itemRepos.findById(id).map(ItemDTO::new).orElse(null);
    }
    
    @Override
    //@CacheEvict(value = "item", allEntries = true, beforeInvocation = true)
    public @NotNull ItemDTO updateItem(@NotNull ItemUpdateDTO item) {
        Preconditions.checkNotNull(item.getItemId(), "Item is not identifiable");
        Item it = itemRepos.findById(item.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found", "itemId", item.getItemId().toString()));
        // check VAR
        Preconditions.checkState(item.getStatus() == null ||
                VALID_TRANSITIONS.get(it.getStatus()).contains(item.getStatus()),
                "Invalid status transition");
        Preconditions.checkState(item.getStatus() == Item.Status.QUEUE || item.getReservePrice() == null,
                "Cannot change reserve price at this time");
        Preconditions.checkState(item.getStatus() == Item.Status.QUEUE || item.getBuyInPrice() == null,
                "Cannot change buy in price at this time");
        Preconditions.checkState(item.getOwnerId() == null, "Cannot change owner");
        return new ItemDTO(itemRepos.save(mapDTOToEntity(item, it)));
    }
    
    @Override
    public List<AttachmentDTO> uploadAttachment(int id, AttachmentUploadDTO dto) throws IOException {
        if (dto.getFiles() == null || dto.getFiles().isEmpty()) return Collections.emptyList();
        for (MultipartFile f : dto.getFiles()) {
            Preconditions.checkState(f.getSize() <= 10000000, "File size must be less than 10MB");
        }
        List<AttachmentDTO> attachments = new ArrayList<>();
        for(MultipartFile file : dto.getFiles()) {
            attachments.add(attachmentService.uploadItemAttachment(file, id));
        }
        return attachments;
    }
    
    @Override
    public void deleteAttachment(int itemId, int attachmentId) {
        attachmentService.deleteItemAttachment(itemId, attachmentId);
    }

    @Override
   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort", value = "item")
    public @NotNull Page<ItemDTO> getItems(@NotNull Pageable pageable,
                                           @Nullable Integer minPrice,
                                           @Nullable Integer maxPrice,
                                           @Nullable Item.Status status,
                                           @Nullable Integer categoryId,
                                           @Nullable String search) {
        ItemSpecification spec = new ItemSpecification(minPrice, maxPrice, status, categoryId, search);
        return itemRepos.findAll(spec,pageable).map(ItemDTO::new);
    }

    @Override
   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort", value = "item")
    public @NotNull Page<ItemDTO> getItemsByPrice(@NotNull Pageable pageable, int minPrice, int maxPrice) {
        return itemRepos.findItemByReservePriceBetweenAndStatus(BigDecimal.valueOf(minPrice), BigDecimal.valueOf(maxPrice), Item.Status.IN_AUCTION, pageable)
                .map(ItemDTO::new);
    }


   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #status.toString()", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByStatus(@NotNull Pageable pageable, @NotNull Item.Status status) {
        return itemRepos.findItemByStatus(status, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #ownerId", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByOwnerId(@NotNull Pageable pageable, int ownerId) {
        return itemRepos.findItemByOwnerAccountId(ownerId, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #buyerId", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByBuyerId(@NotNull Pageable pageable, int buyerId) {
        return itemRepos.findItemByBuyerAccountId(buyerId, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #name", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name) {
        return itemRepos.findItemByNameContaining(name, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #name + #status", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name, Item.Status status) {
        return itemRepos.findItemByNameContainingAndStatus(name,status, pageable).map(ItemDTO::new);
    }
   
   //@Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId) {
        return itemRepos.findItemByItemCategoryItemCategoryId(categoryId, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key="'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId + #status.toString()", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId, Item.Status status) {
        return itemRepos.findItemByItemCategoryItemCategoryIdAndStatus(categoryId,status, pageable).map(ItemDTO::new);
    }

   //@Cacheable(key="'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId  + #minPrice + #maxPrice", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryIdByPrice(@NotNull Pageable pageable, int categoryId, int minPrice, int maxPrice) {
        return itemRepos.findItemByReservePriceBetweenAndItemCategory_ItemCategoryIdAndStatus( BigDecimal.valueOf(minPrice), BigDecimal.valueOf(maxPrice),categoryId,Item.Status.IN_AUCTION, pageable)
                .map(ItemDTO::new);
    }
}

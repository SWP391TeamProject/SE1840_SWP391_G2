package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.CreateItemRequestDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.MappingException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashSet;

@Service
@CacheConfig (cacheNames = "item")
public class ItemServiceImpl implements ItemService {
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
    public @NotNull Item mapDTOToEntity(@NotNull ItemDTO itemDTO, @NotNull Item item) {
        item.setItemId(itemDTO.getItemId());
        if (itemDTO.getCategory() != null)
            item.setItemCategory(itemCategoryRepos.findById(itemDTO.getCategory().getItemCategoryId())
                .orElseThrow(() -> new MappingException("Category not found: " + itemDTO.getCategory())));
        if (itemDTO.getName() != null)
            item.setName(itemDTO.getName());
        if (itemDTO.getDescription() != null)
            item.setDescription(itemDTO.getDescription());
        if (itemDTO.getReservePrice() != null)
            item.setReservePrice(itemDTO.getReservePrice());
        if (itemDTO.getBuyInPrice() != null)
            item.setBuyInPrice(itemDTO.getBuyInPrice());
        if (itemDTO.getStatus() != null)
            item.setStatus(itemDTO.getStatus());
        if (itemDTO.getOwner() != null)
            item.setOwner(accountRepos.findById(itemDTO.getOwner().getAccountId())
                .orElseThrow(() -> new MappingException("Account not found: " + itemDTO.getOwner())));
        if (itemDTO.getColor() != null)
            item.setColor(itemDTO.getColor());
        if (itemDTO.getSize() != null)
            item.setSize(itemDTO.getSize());
        if (itemDTO.getWeight() != null)
            item.setWeight(itemDTO.getWeight());
        if (itemDTO.getBrand() != null)
            item.setBrand(itemDTO.getBrand());
        if (itemDTO.getAge() != null)
            item.setAge(itemDTO.getAge());
        if (itemDTO.getMaterial() != null)
            item.setMaterial(itemDTO.getMaterial());
        // DO NOT CHANGE ORDER
//        if (itemDTO.getOrderId() != null)
//            item.setOrder(itemDTO.getOrderId());
        return item;
    }

    @Override
    @CacheEvict(value = "item", allEntries = true, beforeInvocation = true)
    public @NotNull ItemDTO createItem(@NotNull CreateItemRequestDTO requestDTO) throws IOException {
        ItemDTO itemDTO = requestDTO.getItem();
        Preconditions.checkNotNull(itemDTO.getItemId(), "Item ID is required");
        Preconditions.checkNotNull(itemDTO.getName(), "Name is required");
        Preconditions.checkState(itemDTO.getName().length() >= 5, "Name must be at least 5 characters");
        Preconditions.checkNotNull(itemDTO.getDescription(), "Description is required");
        Preconditions.checkNotNull(itemDTO.getReservePrice(), "Reserve price is required");
        Preconditions.checkState(itemDTO.getReservePrice().signum() > 0, "Reserve price must not be negative");
        Preconditions.checkNotNull(itemDTO.getBuyInPrice(), "Buy-in price is required");
        Preconditions.checkState(itemDTO.getBuyInPrice().signum() > 0, "Buy-in price must not be negative");
        Preconditions.checkNotNull(itemDTO.getOwner(), "Owner is required");
        if (requestDTO.getFiles() != null) {
            for (MultipartFile f : requestDTO.getFiles()) {
                Preconditions.checkState(f.getSize() <= 10000000, "File size must be less than 10MB");
            }
        }
        
        if (itemDTO.getStatus() == null)
            itemDTO.setStatus(Item.Status.QUEUE);

        Item savedItem = itemRepos.save(mapDTOToEntity(itemDTO, new Item()));
        ItemDTO dto = new ItemDTO(savedItem);
        dto.setAttachments(new HashSet<>());
        for(MultipartFile file : requestDTO.getFiles()) {
            try {
                dto.getAttachments().add(attachmentService.uploadItemAttachment(file, savedItem.getItemId()));
            } catch (IOException e) {
                throw new IOException("Error uploading attachment: " + e.getMessage());
            }
        }
        return dto;
    }

    @Override
    @Cacheable(value = "item", key = "#id")
    public ItemDTO getItemById(int id) {
        return itemRepos.findById(id).map(ItemDTO::new).orElse(null);
    }

    @Override
    @CacheEvict(value = "item", allEntries = true, beforeInvocation = true)
    public @NotNull ItemDTO updateItem(@NotNull ItemDTO item) {
        Preconditions.checkNotNull(item.getItemId(), "Item is not identifiable");
        Item it = itemRepos.findById(item.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found", "itemId", item.getItemId().toString()));
        return new ItemDTO(itemRepos.save(mapDTOToEntity(item, it)));
    }

    @Override
    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort", value = "item")
    public @NotNull Page<ItemDTO> getItems(@NotNull Pageable pageable) {
        return itemRepos.findAll(pageable).map(ItemDTO::new);
    }

    @Override
    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort", value = "item")
    public @NotNull Page<ItemDTO> getItemsByPrice(@NotNull Pageable pageable, int minPrice, int maxPrice) {
        return itemRepos.findItemByReservePriceBetweenAndStatus(BigDecimal.valueOf(minPrice), BigDecimal.valueOf(maxPrice), Item.Status.IN_AUCTION, pageable)
                .map(ItemDTO::new);
    }


    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #status.toString()", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByStatus(@NotNull Pageable pageable, @NotNull Item.Status status) {
        return itemRepos.findItemByStatus(status, pageable).map(ItemDTO::new);
    }

    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #ownerId", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByOwnerId(@NotNull Pageable pageable, int ownerId) {
        return itemRepos.findItemByOwnerAccountId(ownerId, pageable).map(ItemDTO::new);
    }

    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #name", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name) {
        return itemRepos.findItemByNameContaining(name, pageable).map(ItemDTO::new);
    }

    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #name + #status", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name, Item.Status status) {
        return itemRepos.findItemByNameContainingAndStatus(name,status, pageable).map(ItemDTO::new);
    }

    @Cacheable(key = "'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId) {
        return itemRepos.findItemByItemCategoryItemCategoryId(categoryId, pageable).map(ItemDTO::new);
    }

    @Cacheable(key="'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId + #status.toString()", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId, Item.Status status) {
        return itemRepos.findItemByItemCategoryItemCategoryIdAndStatus(categoryId,status, pageable).map(ItemDTO::new);
    }

    @Cacheable(key="'itemsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort + #categoryId  + #minPrice + #maxPrice", value = "item")
    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryIdByPrice(@NotNull Pageable pageable, int categoryId, int minPrice, int maxPrice) {
        return itemRepos.findItemByReservePriceBetweenAndItemCategory_ItemCategoryIdAndStatus( BigDecimal.valueOf(minPrice), BigDecimal.valueOf(maxPrice),categoryId,Item.Status.IN_AUCTION, pageable)
                .map(ItemDTO::new);
    }
}

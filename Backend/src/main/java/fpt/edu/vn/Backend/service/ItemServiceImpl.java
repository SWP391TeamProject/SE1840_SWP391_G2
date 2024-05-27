package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.MappingException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.repository.ItemRepos;
import fpt.edu.vn.Backend.repository.OrderRepos;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ItemServiceImpl implements ItemService {
    private final AccountRepos accountRepos;
    private final ItemRepos itemRepos;
    private final ItemCategoryRepos itemCategoryRepos;
    private final OrderRepos orderRepos;

    @Autowired
    public ItemServiceImpl(AccountRepos accountRepos,
                           ItemRepos itemRepos,
                           ItemCategoryRepos itemCategoryRepos,
                           OrderRepos orderRepos) {
        this.accountRepos = accountRepos;
        this.itemRepos = itemRepos;
        this.itemCategoryRepos = itemCategoryRepos;
        this.orderRepos = orderRepos;
    }

    @Override
    public @NotNull ItemDTO mapEntityToDTO(@NotNull Item item, @NotNull ItemDTO itemDTO) {
        itemDTO.setItemId(item.getItemId());
        if (item.getItemCategory() != null)
            itemDTO.setCategoryId(item.getItemCategory().getItemCategoryId());
        itemDTO.setName(item.getName());
        itemDTO.setDescription(item.getDescription());
        itemDTO.setReservePrice(item.getReservePrice());
        itemDTO.setBuyInPrice(item.getBuyInPrice());
        itemDTO.setStatus(item.getStatus());
        itemDTO.setCreateDate(item.getCreateDate());
        itemDTO.setUpdateDate(item.getUpdateDate());
        if (item.getOwner() != null)
            itemDTO.setOwnerId(item.getOwner().getAccountId());
        Order order = item.getOrder();
        if (order != null)
            itemDTO.setOrderId(order.getOrderId());
        return itemDTO;
    }

    @Override
    public @NotNull Item mapDTOToEntity(@NotNull ItemDTO itemDTO, @NotNull Item item) {
        item.setItemId(itemDTO.getItemId());
        if (itemDTO.getCategoryId() != null)
            item.setItemCategory(itemCategoryRepos.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new MappingException("Category not found: " + itemDTO.getCategoryId())));
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
        if (itemDTO.getOwnerId() != null)
            item.setOwner(accountRepos.findById(itemDTO.getOwnerId())
                .orElseThrow(() -> new MappingException("Account not found: " + itemDTO.getOwnerId())));
        if (itemDTO.getOrderId() != null)
            item.setOrder(orderRepos.findById(itemDTO.getOrderId())
                    .orElseThrow(() -> new MappingException("Order not found: " + itemDTO.getOrderId())));
        return item;
    }

    @Override
    public @NotNull ItemDTO createItem(@NotNull ItemDTO itemDTO) {
        return mapEntityToDTO(itemRepos.save(mapDTOToEntity(itemDTO, new Item())));
    }

    @Override
    public ItemDTO getItemById(int id) {
        return itemRepos.findById(id).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public ItemDTO updateItem(@NotNull ItemDTO item) {
        Preconditions.checkNotNull(item.getItemId(), "Item is not identifiable");
        Item it = itemRepos.findById(item.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found", "itemId", item.getItemId().toString()));
        return mapEntityToDTO(itemRepos.save(mapDTOToEntity(item, it)));
    }

    @Override
    public @NotNull Page<ItemDTO> getItems(@NotNull Pageable pageable) {
        return itemRepos.findAll(pageable).map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<ItemDTO> getItemsByStatus(@NotNull Pageable pageable, @NotNull Item.Status status) {
        return itemRepos.findItemByStatus(status, pageable).map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<ItemDTO> getItemsByOwnerId(@NotNull Pageable pageable, int ownerId) {
        return itemRepos.findItemByOwnerAccountId(ownerId, pageable).map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId) {
        return itemRepos.findItemByItemCategoryItemCategoryId(categoryId, pageable).map(this::mapEntityToDTO);
    }
}

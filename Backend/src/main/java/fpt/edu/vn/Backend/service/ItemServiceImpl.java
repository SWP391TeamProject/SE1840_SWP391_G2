package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.exception.MappingException;
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
        itemDTO.setCategoryId(item.getItemCategory().getItemCategoryId());
        itemDTO.setName(item.getName());
        itemDTO.setDescription(item.getDescription());
        itemDTO.setReservePrice(item.getReservePrice());
        itemDTO.setBuyInPrice(item.getBuyInPrice());
        itemDTO.setStatus(item.getStatus());
        itemDTO.setCreateDate(item.getCreateDate());
        itemDTO.setUpdateDate(item.getUpdateDate());
        itemDTO.setOwnerId(item.getOwner().getAccountId());
        Order order = item.getOrder();
        if (order != null)
            itemDTO.setOrderId(order.getOrderId());
        return itemDTO;
    }

    @Override
    public @NotNull Item mapDTOToEntity(@NotNull ItemDTO itemDTO, @NotNull Item item) {
        item.setItemId(itemDTO.getItemId());
        item.setItemCategory(itemCategoryRepos.findById(itemDTO.getCategoryId())
                .orElseThrow(() -> new MappingException("Category not found")));
        item.setName(itemDTO.getName());
        item.setDescription(itemDTO.getDescription());
        item.setReservePrice(itemDTO.getReservePrice());
        item.setBuyInPrice(itemDTO.getBuyInPrice());
        item.setStatus(itemDTO.getStatus());
        item.setCreateDate(itemDTO.getCreateDate());
        item.setUpdateDate(itemDTO.getUpdateDate());
        item.setOwner(accountRepos.findById(itemDTO.getOwnerId())
                .orElseThrow(() -> new MappingException("Account not found")));
        if (itemDTO.getOrderId() != null)
            item.setOrder(orderRepos.findById(itemDTO.getOrderId())
                    .orElseThrow(() -> new MappingException("Order not found")));
        return item;
    }

    @Override
    public @NotNull ItemDTO createItem(@NotNull ItemDTO itemDTO) {
        itemRepos.save(mapDTOToEntity(itemDTO));
        return itemDTO;
    }

    @Override
    public ItemDTO getItemById(int id) {
        return itemRepos.findItemByItemId(id).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public boolean updateItem(@NotNull ItemDTO item) {
        Preconditions.checkNotNull(item.getItemId(), "Item is not identifiable");
        return itemRepos.updateItemByItemId(item.getItemId(), mapDTOToEntity(item));
    }

    @Override
    public boolean deleteItem(int id) {
        return itemRepos.deleteItemByItemId(id);
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

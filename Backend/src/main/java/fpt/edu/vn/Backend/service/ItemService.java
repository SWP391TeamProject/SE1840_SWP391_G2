package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.CreateItemRequestDTO;
import fpt.edu.vn.Backend.pojo.Item;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;

public interface ItemService {
    @NotNull ItemDTO mapEntityToDTO(@NotNull Item item, @NotNull ItemDTO itemDTO);
    @NotNull default ItemDTO mapEntityToDTO(@NotNull Item item) {
        return mapEntityToDTO(item, new ItemDTO());
    }
    @NotNull Item mapDTOToEntity(@NotNull ItemDTO itemDTO, @NotNull Item item);

    @NotNull ItemDTO createItem(@NotNull CreateItemRequestDTO itemDTO) throws IOException;
    @Nullable ItemDTO getItemById(int id);
    ItemDTO updateItem(@NotNull ItemDTO itemDTO);


    @NotNull Page<ItemDTO> getItems(@NotNull Pageable pageable);

    @NotNull Page<ItemDTO> getItemsByPrice(@NotNull Pageable pageable, int minPrice, int maxPrice);
    @NotNull Page<ItemDTO> getItemsByStatus(@NotNull Pageable pageable, @NotNull Item.Status status);
    @NotNull Page<ItemDTO> getItemsByOwnerId(@NotNull Pageable pageable, int ownerId);
    @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId);
    @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId, Item.Status status);
    @NotNull Page<ItemDTO> getItemsByCategoryIdByPrice(@NotNull Pageable pageable, int categoryId, int minPrice, int maxPrice);
    @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name);
    @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name,Item.Status status);

}

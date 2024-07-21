package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.DTO.request.AttachmentUploadDTO;
import fpt.edu.vn.Backend.DTO.request.ItemUpdateDTO;
import fpt.edu.vn.Backend.pojo.Item;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

public interface ItemService {
    @NotNull Item mapDTOToEntity(@NotNull ItemUpdateDTO itemDTO, @NotNull Item item);

    @NotNull ItemDTO createItem(@NotNull ItemUpdateDTO itemDTO) throws IOException;
    @Nullable ItemDTO getItemById(int id);
    ItemDTO updateItem(@NotNull ItemUpdateDTO itemDTO);
    List<AttachmentDTO> uploadAttachment(int id, AttachmentUploadDTO dto) throws IOException;
    void deleteAttachment(int attachmentId, int itemId);

    @NotNull Page<ItemDTO> getItems(@NotNull Pageable pageable,
                                    @Nullable Integer minPrice,
                                    @Nullable Integer maxPrice,
                                    @Nullable Item.Status status,
                                    @Nullable Integer categoryId,
                                    @Nullable String search);

    @NotNull Page<ItemDTO> getItemsByPrice(@NotNull Pageable pageable, int minPrice, int maxPrice);
    @NotNull Page<ItemDTO> getItemsByStatus(@NotNull Pageable pageable, @NotNull Item.Status status);
    @NotNull Page<ItemDTO> getItemsByOwnerId(@NotNull Pageable pageable, int ownerId);
    @NotNull Page<ItemDTO> getItemsByBuyerId(@NotNull Pageable pageable, int buyerId);
    @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId);
    @NotNull Page<ItemDTO> getItemsByCategoryId(@NotNull Pageable pageable, int categoryId, Item.Status status);
    @NotNull Page<ItemDTO> getItemsByCategoryIdByPrice(@NotNull Pageable pageable, int categoryId, int minPrice, int maxPrice);
    @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name);
    @NotNull Page<ItemDTO> getItemsByName(@NotNull Pageable pageable, String name,Item.Status status);
}

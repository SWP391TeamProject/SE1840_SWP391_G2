package fpt.edu.vn.Backend.serviceTest;


import fpt.edu.vn.Backend.DTO.ItemCategoryDTO;
import fpt.edu.vn.Backend.DTO.request.ItemCategoryRequestDTO;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import fpt.edu.vn.Backend.repository.ItemCategoryRepos;
import fpt.edu.vn.Backend.service.ItemCategoryImpl;
import fpt.edu.vn.Backend.service.ItemCategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ItemCategoryImplTest {

    @InjectMocks
    private ItemCategoryImpl itemCategoryService;

    @Mock
    private ItemCategoryRepos itemCategoryRepos;

    private ItemCategory itemCategory;

    private ItemCategoryRequestDTO itemCategoryRequestDTO;

    private ItemCategoryDTO itemCategoryDTO;

    @BeforeEach
    public void setUp() {
        itemCategory = new ItemCategory();
        itemCategory.setItemCategoryId(1);
        itemCategory.setName("Category1");
        itemCategory.setCreateDate(LocalDateTime.now());
        itemCategory.setUpdateDate(LocalDateTime.now());

        itemCategoryDTO = new ItemCategoryDTO();
        itemCategoryDTO.setName("Category1");
        itemCategoryDTO.setCreateDate(LocalDateTime.now());
        itemCategoryDTO.setUpdateDate(LocalDateTime.now());

        itemCategoryRequestDTO = new ItemCategoryRequestDTO();
        itemCategoryRequestDTO.setItemCategoryId(2);
        itemCategoryRequestDTO.setName("Category2");

    }

    @Test
    public void testCreateItemCategory() {
        when(itemCategoryRepos.save(any(ItemCategory.class))).thenReturn(itemCategory);

        ItemCategoryDTO createdCategory = itemCategoryService.createItemCategory(itemCategoryRequestDTO);

        assertNotNull(createdCategory);
        assertEquals(itemCategory.getName(), createdCategory.getName());
    }

    @Test
    public void testUpdateItemCategory() {
        when(itemCategoryRepos.findById(anyInt())).thenReturn(Optional.of(itemCategory));
        when(itemCategoryRepos.save(any(ItemCategory.class))).thenReturn(itemCategory);

        itemCategoryRequestDTO.setItemCategoryId(2);
        itemCategoryRequestDTO.setName("Updated Category");

        ItemCategoryDTO updatedCategory = itemCategoryService.updateItemCategory(itemCategoryRequestDTO);

        assertNotNull(updatedCategory);
        assertEquals("Updated Category", updatedCategory.getName());
    }





    @Test
    public void testDeleteItemCategory() {
        when(itemCategoryRepos.existsById(anyInt())).thenReturn(true);

        ResponseEntity<ItemCategoryDTO> response = itemCategoryService.deleteItemCategory(1);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        verify(itemCategoryRepos, times(1)).deleteById(1);
    }
    @Test
    public void testGetItemCategoryById() {
        when(itemCategoryRepos.findById(anyInt())).thenReturn(Optional.of(itemCategory));

        ItemCategoryDTO categoryDTO = itemCategoryService.getItemCategoryById(1);

        assertNotNull(categoryDTO);
        assertEquals(itemCategory.getName(), categoryDTO.getName());
    }

    @Test
    public void testGetAllItemCategories() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ItemCategory> itemCategoryPage = new PageImpl<>(List.of(itemCategory));

        when(itemCategoryRepos.findAll(any(Pageable.class))).thenReturn(itemCategoryPage);

        Page<ItemCategoryDTO> categoryDTOPage = itemCategoryService.getAllItemCategories(pageable);

        assertNotNull(categoryDTOPage);
        assertEquals(1, categoryDTOPage.getTotalElements());
    }

}

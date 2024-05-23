package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
    @Nullable
    private Integer itemId;
    private int categoryId;
    @NotNull
    private String name;
    @NotNull
    private String description;
    @NotNull
    private BigDecimal reservePrice;
    @NotNull
    private BigDecimal buyInPrice;
    @NotNull
    private Item.Status status;
    @NotNull
    private LocalDateTime createDate;
    @NotNull
    private LocalDateTime updateDate;
    private int ownerId;
    @Nullable
    private Integer orderId;
}
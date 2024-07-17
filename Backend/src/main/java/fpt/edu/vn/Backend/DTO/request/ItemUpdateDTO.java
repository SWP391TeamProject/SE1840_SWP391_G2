package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemUpdateDTO implements Serializable {
    private Integer itemId;
    //
    private Integer categoryId;
    private String name;
    private String description;
    private BigDecimal reservePrice;
    private BigDecimal buyInPrice;
    private BigDecimal soldPrice;
    private Item.Status status;
    private Integer ownerId;
    private String color;
    private String size;
    private String weight;
    private String brand;
    private Integer age;
    private String material;
    //
    private Integer consignmentId;
}

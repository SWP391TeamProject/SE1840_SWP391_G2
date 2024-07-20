package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDTO {
    private Integer itemId;
    private ItemDTO item;
    private Integer orderId;
    private BigDecimal soldPrice;
    private LocalDateTime createDate;

    public static OrderDetailDTO minimal(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.itemId = orderDetail.getId().getItemId();
        dto.orderId = orderDetail.getId().getOrderId();
        dto.soldPrice = orderDetail.getSoldPrice();
        dto.createDate = orderDetail.getCreateDate();
        return dto;
    }

    public static OrderDetailDTO full(OrderDetail orderDetail) {
        OrderDetailDTO dto = minimal(orderDetail);
        dto.item = new ItemDTO(orderDetail.getItem());
        return dto;
    }
}

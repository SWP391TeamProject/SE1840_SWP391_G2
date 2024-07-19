package fpt.edu.vn.Backend.DTO;

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
    private Integer orderId;
    private BigDecimal soldPrice;
    private LocalDateTime createDate;

    public OrderDetailDTO(OrderDetail orderDetail) {
        this.itemId = orderDetail.getId().getItemId();
        this.orderId = orderDetail.getId().getOrderId();
        this.soldPrice = orderDetail.getSoldPrice();
        this.createDate = orderDetail.getCreateDate();
    }
}

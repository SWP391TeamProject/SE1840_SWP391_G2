package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateDTO {
    private Order.ShippingStatus shippingStatus;
    private String shippingAddress;
    private String shippingNote;
}

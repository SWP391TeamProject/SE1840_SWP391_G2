package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailKey {
    @Column(name = "order_id")
    private int orderId;
    @Column(name = "item_id")
    private int itemId;
}

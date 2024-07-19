package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailKey implements Serializable {
    @Serial
    private static final long serialVersionUID = -2552920668574201795L;

    @Column(name = "order_id")
    private int orderId;

    @Column(name = "jewelry_id")
    private int itemId;
}

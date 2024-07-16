package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class UpdateOrderStatusRequestDTO {
    private List<Integer> orderId;
    private String status;
}

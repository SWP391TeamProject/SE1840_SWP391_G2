package fpt.edu.vn.Backend.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AccountAdminDTO {
    private int userId;
    private String nickname;
    private List<Integer> role;
    private String email;
    private String phone;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}

package fpt.edu.vn.Backend.dto;

import fpt.edu.vn.Backend.pojo.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class AccountDTO {
    private long userId;
    private String nickname;
    private String email;
    private String phone;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private List<String> role;

    public AccountDTO(int userId, String nickname, String email, String phone, BigDecimal balance, LocalDateTime createDate, LocalDateTime updateDate, List<String> role) {
        this.userId = userId;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.balance = balance;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.role = role;
    }

}
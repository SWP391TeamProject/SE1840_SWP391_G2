package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class AccountDTO {
    private int accountId;
    private String nickname;
    private List<Integer> role;
    private String email;
    private String phone;
    private int status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    // getters and setters

    public AccountDTO(Account account) {
        this.accountId = account.getAccountId();
        this.nickname = account.getNickname();
        this.email = account.getEmail();
        this.phone = account.getPhone();
        this.status = 1;
        this.balance = account.getBalance();
        this.createDate = account.getCreateDate();
        this.updateDate = account.getUpdateDate();
        this.role = account.getAuthorities().stream().map(Role::getRoleId).toList();
    }


}
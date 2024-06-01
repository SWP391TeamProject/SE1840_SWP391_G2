package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@ToString
public class AccountDTO {
    private Integer accountId;
    private String nickname;
    private Account.Role role;
    private AttachmentDTO avatar;
    private String email;
    private String phone;
    private String password;
    private Account.Status status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public AccountDTO(Account account) {
        this.accountId = account.getAccountId();
        this.nickname = account.getNickname();
        this.role = account.getRole();
        this.avatar = new AttachmentDTO(account.getAvatarUrl());
        this.email = account.getEmail();
        this.phone = account.getPhone();
        this.password = account.getPassword();
        this.status = account.getStatus();
        this.balance = account.getBalance();
        this.createDate = account.getCreateDate();
        this.updateDate = account.getUpdateDate();
    }
}
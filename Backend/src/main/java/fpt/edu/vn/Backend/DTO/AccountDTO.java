package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@ToString
public class AccountDTO {
    private Integer accountId;
    private String nickname;
    private Set<Account.Role> roles;
    private AttachmentDTO avatar;
    private String email;
    private String phone;
    private String password;
    private Account.Status status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
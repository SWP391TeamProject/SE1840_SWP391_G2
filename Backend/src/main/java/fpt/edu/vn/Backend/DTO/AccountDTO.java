package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class AccountDTO implements Serializable {
    private Integer accountId;
    private String nickname;
    private Boolean dummy;
    private boolean require2fa;
    private Account.Role role;
    private AttachmentDTO avatar;
    private String email;
    private String phone;
    private String password;
    private Account.Status status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private boolean isKyc;

    public static AccountDTO redacted(Account account) {
        return AccountDTO.builder()
                .accountId(account.getAccountId())
                .nickname(account.getNickname())
                .status(account.getStatus())
                .role(account.getRole())
                .dummy(account.isDummy())
                .avatar(account.getAvatarUrl() == null ? null : new AttachmentDTO(account.getAvatarUrl()))
                .build();
    }

    public AccountDTO(Account account) {
        this.accountId = account.getAccountId();
        this.nickname = account.getNickname();
        this.require2fa = account.isRequire2fa();
        this.dummy = account.isDummy();
        this.role = account.getRole();
        this.avatar = account.getAvatarUrl()==null? null : new AttachmentDTO(account.getAvatarUrl());
        this.email = account.getEmail();
        this.phone = account.getPhone();
        this.password = account.getPassword();
        this.status = account.getStatus();
        this.balance = account.getBalance();
        this.createDate = account.getCreateDate();
        this.updateDate = account.getUpdateDate();
        this.isKyc = account.getCitizenCard() != null;
    }
}
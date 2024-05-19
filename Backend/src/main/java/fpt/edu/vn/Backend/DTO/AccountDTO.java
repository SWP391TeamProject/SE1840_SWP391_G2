package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountDTO {
    private int userId;
    private String nickname;
    private String role;
    private String email;
    private String phone;
    private boolean status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    // getters and setters

    public AccountDTO(Account account) {
        this.userId = account.getUserId();
        this.nickname = account.getNickname();
        this.role = account.getRole();
        this.email = account.getEmail();
        this.phone = account.getPhone();
        this.status = account.isStatus();
        this.balance = account.getBalance();
        this.createDate = account.getCreateDate();
        this.updateDate = account.getUpdateDate();
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }
}
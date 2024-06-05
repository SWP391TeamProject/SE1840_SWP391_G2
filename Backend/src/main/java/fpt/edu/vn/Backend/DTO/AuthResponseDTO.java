package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Data
@Builder
@AllArgsConstructor
@ToString
public class AuthResponseDTO {
    private int id;
    private String accessToken;
    private Account.Role role;
    private String email;
    private String phone;
    private String nickname;
    private AttachmentDTO attachment;
    private String address;
    private Account.Status status;
    private BigDecimal balance;

    public AuthResponseDTO(Account account, String accessToken) {
        Random random = new Random();
        List<String> choice = List.of("Hanoi", "HCM", "Da Nang", "Hai Phong", "Can Tho", "Vung Tau", "Nha Trang", "Da Lat", "Hue", "Quang Ninh");

        this.id = account.getAccountId();
        this.accessToken = accessToken;
        this.role = account.getRole();
        this.email = account.getEmail();
        this.phone = account.getPhone();
        this.nickname = account.getNickname();
        this.attachment = new AttachmentDTO(account.getAvatarUrl());
        this.address =  random.nextInt(100) + " " + choice.get(random.nextInt(choice.size()));
        this.status = account.getStatus();
        this.balance = account.getBalance() == null ? BigDecimal.ZERO : account.getBalance();
    }

}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@ToString
public class AuthResponseDTO {
    private int id;
    private String accessToken;
    private String username;
    private Set<Account.Role> roles;
    private String refreshToken;
    private String email;
    private String phone;
    private String nickname;
    private String avatar;
    private String address;
}
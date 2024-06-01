package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class AuthResponseDTO {
    private int id;
    private String accessToken;
    private String username;
    private Account.Role role;
    private String refreshToken;
    private String email;
    private String phone;
    private String nickname;
    private String avatar;
    private String address;
}
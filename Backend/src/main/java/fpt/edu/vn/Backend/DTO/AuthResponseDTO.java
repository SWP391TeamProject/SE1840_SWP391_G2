package fpt.edu.vn.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@ToString
public class AuthResponseDTO {

    private String accessToken;
    private String username;
    private String role;
    private String refreshToken;
    private String email;
    private String phone;
    private String nickname;
    private String avatar;
    private String address;
}
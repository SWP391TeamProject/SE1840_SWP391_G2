package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtUser {
    private int userId;
    private String email;
    private Account.Role role;
}

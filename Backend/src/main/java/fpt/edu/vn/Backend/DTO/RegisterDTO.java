package fpt.edu.vn.Backend.DTO;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String confirmPassword;
}
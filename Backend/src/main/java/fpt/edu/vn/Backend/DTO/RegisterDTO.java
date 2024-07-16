package fpt.edu.vn.Backend.DTO;

import lombok.Data;

import java.io.Serializable;

@Data
public class RegisterDTO implements Serializable {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
}

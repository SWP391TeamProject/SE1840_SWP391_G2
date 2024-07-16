package fpt.edu.vn.Backend.DTO.request;

import lombok.Data;

import java.io.Serializable;

@Data
public class ResetPasswordConfirmDTO implements Serializable {
    private String code;
    private String password;
}

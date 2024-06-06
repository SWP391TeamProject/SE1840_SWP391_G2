package fpt.edu.vn.Backend.DTO.request;

import lombok.Data;

@Data
public class ResetPasswordConfirmDTO {
    private String code;
    private String password;
}

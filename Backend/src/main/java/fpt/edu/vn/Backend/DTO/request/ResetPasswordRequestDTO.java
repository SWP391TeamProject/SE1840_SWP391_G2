package fpt.edu.vn.Backend.DTO.request;

import lombok.*;

import java.io.Serializable;

@Data
public class ResetPasswordRequestDTO implements Serializable {
    private String email;
}

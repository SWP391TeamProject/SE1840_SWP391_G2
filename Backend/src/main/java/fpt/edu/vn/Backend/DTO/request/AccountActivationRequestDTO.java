package fpt.edu.vn.Backend.DTO.request;

import lombok.Data;

import java.io.Serializable;

@Data
public class AccountActivationRequestDTO implements Serializable {
    private String email;
}

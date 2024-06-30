package fpt.edu.vn.Backend.DTO.request;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChangePasswordDTO implements Serializable {
    String oldPassword;
    String newPassword;
    String confirmPassword;


}

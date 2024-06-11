package fpt.edu.vn.Backend.DTO.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChangePasswordDTO {
    String oldPassword;
    String newPassword;
    String confirmPassword;


}

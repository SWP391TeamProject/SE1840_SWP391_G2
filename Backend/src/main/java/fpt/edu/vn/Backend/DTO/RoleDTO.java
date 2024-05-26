package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Role;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Data
public class RoleDTO {

    private int roleId;
    private String roleName;
}

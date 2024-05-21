package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Role;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Data
public class RoleDTO {


    enum role{
        ADMIN,
        MANAGER,
        MEMBER,
        STAFF,
    }
    private role roleName;

    public RoleDTO(String s) {
        this.roleName = role.valueOf(s);
    }

}

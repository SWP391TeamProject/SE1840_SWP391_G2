package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roleId;

    enum role{
        ADMIN, MEMBER,MANAGER,STAFF
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private role roleName;

}

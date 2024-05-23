package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Entity
@Data

public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roleId;

    public static enum role{
        ADMIN, MEMBER,MANAGER,STAFF
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private role roleName;

}

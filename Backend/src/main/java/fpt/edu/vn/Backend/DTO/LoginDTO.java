package fpt.edu.vn.Backend.DTO;


import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LoginDTO implements Serializable {


    private String email;


    private String password;
}
package fpt.edu.vn.Backend.DTO;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LoginDTO {


    private String email;


    private String password;
}
package fpt.edu.vn.Backend.security;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
@EqualsAndHashCode(callSuper = true)
@Setter
@Getter
public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private String token;

    public CustomAuthenticationToken(Object principal, Object credentials, String token) {
        super(principal, credentials);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

}

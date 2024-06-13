package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.pojo.Account;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@EqualsAndHashCode(callSuper = false)
@Getter
public class BiddifyUser extends User {
    private final int userID;

    public BiddifyUser(String username, String password, Collection<? extends GrantedAuthority> authorities, int userID) {
        super(username, password, authorities);
        this.userID = userID;
    }

    @NotNull
    public Account.Role getRole() {
        return getAuthorities().isEmpty() ? Account.Role.MEMBER :
                Account.Role.valueOf(getAuthorities().iterator().next().getAuthority());
    }
}
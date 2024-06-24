package fpt.edu.vn.Backend.oauth2.security;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.security.BiddifyUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class OAuth2BiddifyUser extends BiddifyUser implements OAuth2User {
    private Map<String, Object> attributes;

    public OAuth2BiddifyUser(String username, String password, Collection<? extends GrantedAuthority> authorities, int userID) {
        super(username, password, authorities, userID);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(getUserID());
    }
}

package fpt.edu.vn.Backend.oauth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class OAuth2UserDetailCustom implements OAuth2User, UserDetails {
    private Long id;

    private String username;
    private String password;
    private List<GrantedAuthority> authorityList;
    private boolean isEnabled;
    private boolean accountNonLocked;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;

    private Map<String,Object> attributes;
    public OAuth2UserDetailCustom(Long id, String username,String password,List<GrantedAuthority> authorityList){
        this.id= id;
        this.username = username;
        this.password = password;
        this.authorityList = authorityList;
    }
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorityList;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }
}

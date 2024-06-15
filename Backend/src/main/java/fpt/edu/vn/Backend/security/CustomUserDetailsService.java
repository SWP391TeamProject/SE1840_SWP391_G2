package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountRepos accountRepos;

    @Autowired
    public CustomUserDetailsService(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account user = accountRepos.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        return new BiddifyUser(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(mapRolesToAuthorities(user.getRole())),
                user.getAccountId()
        );
    }

    private GrantedAuthority mapRolesToAuthorities(Account.Role role) {
        return new SimpleGrantedAuthority(role.toString());
    }
}

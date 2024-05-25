package fpt.edu.vn.Backend.oauth2;

import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final AccountRepos accountRepos;
    @Autowired
    public CustomOAuth2UserService(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        // Customize the user as needed
        try{
            return checkOAuth2User(userRequest,oAuth2User);
        }catch(Exception e){
            throw new InternalAuthenticationServiceException(e.getMessage(),e.getCause());
        }
    }

    private OAuth2User checkOAuth2User(OAuth2UserRequest oAuth2UserRequest,OAuth2User oAuth2User){
        OAuth2UserDetail oAuth2UserDetail = OAuth2UserDetailFactory.getOAuth2UserDetail(oAuth2UserRequest.getClientRegistration().getRegistrationId(),oAuth2User.getAttributes());

        if(ObjectUtils.isEmpty(oAuth2UserDetail)){
            throw new ResourceNotFoundException("400","1","can not found oauth2 from properties");
        }
        Optional<Account> account =
                accountRepos.findAccountByEmailAndProvider(
                        oAuth2UserDetail.getEmail(),
                        oAuth2UserRequest.getClientRegistration().getRegistrationId());
        Account accountDetail;
        if(account.isPresent()){
            accountDetail = account.get();
            if(!accountDetail.getProvider().equals(oAuth2UserRequest.getClientRegistration().getRegistrationId())){
                throw new ResourceNotFoundException("400","1","invalid site login registrationId");
            }
            accountDetail = updateOAuth2UserDetail(accountDetail,oAuth2UserDetail);
        }else {
            accountDetail = registerNewOAuth2UserDetail(oAuth2UserRequest,oAuth2UserDetail);
        }
        return new OAuth2UserDetailCustom(
                (long) accountDetail.getAccountId(),
                accountDetail.getEmail(),
                accountDetail.getPassword(),
                (List<GrantedAuthority>) mapRolesToAuthorities(account.get().getAuthorities())
        );
    }


    public Account registerNewOAuth2UserDetail(OAuth2UserRequest oAuth2UserRequest,OAuth2UserDetail oAuth2UserDetail){
            Account account = new Account();
            account.setEmail(oAuth2UserDetail.getEmail());
            account.setProvider(Account.Provider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
            account.setNickname(oAuth2UserDetail.getName());
            return accountRepos.save(account);
    }

    public Account updateOAuth2UserDetail(Account account, OAuth2UserDetail oAuth2UserDetail){
        account.setEmail(oAuth2UserDetail.getEmail());
        return accountRepos.save(account);
    }
    private Collection<GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(String.valueOf(role.getRoleName()))).collect(Collectors.toList());
    }
}

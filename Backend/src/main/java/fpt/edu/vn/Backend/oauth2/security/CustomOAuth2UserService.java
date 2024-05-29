package fpt.edu.vn.Backend.oauth2.security;

import fpt.edu.vn.Backend.oauth2.Exception.OAuth2AuthenticationProcessingException;
import fpt.edu.vn.Backend.oauth2.user.OAuth2UserInfo;
import fpt.edu.vn.Backend.oauth2.user.OAuth2UserInfoFactory;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private AccountRepos accountRepos;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler

            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }
    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if(ObjectUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<Account> accountOptional = accountRepos.findByEmail(oAuth2UserInfo.getEmail());
        Account account;
        if(accountOptional.isPresent()) {
            account = accountOptional.get();
            if(!account.getProvider().equals(Account.AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        account.getProvider() + " account. Please use your " + account.getProvider() +
                        " account to login.");
            }
            account = updateExistingUser(account, oAuth2UserInfo);
        } else {
            account = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(account, oAuth2User.getAttributes());
    }
    private Account registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        Account account = new Account();

        account.setProvider(Account.AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
//        account.setProviderId(oAuth2UserInfo.getId());
        account.setNickname(oAuth2UserInfo.getName());
        account.setEmail(oAuth2UserInfo.getEmail());
//        account.setAvatarUrl(oAuth2UserInfo.setImageUrl();
        account.setPhone(oAuth2UserInfo.getPhone());
        return accountRepos.save(account);
    }

    private Account updateExistingUser(Account existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setNickname(oAuth2UserInfo.getName());
//        existingUser.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        existingUser.setPhone(oAuth2UserInfo.getPhone());

        return accountRepos.save(existingUser);
    }


}

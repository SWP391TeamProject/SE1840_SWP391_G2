package fpt.edu.vn.Backend.oauth2.security;

import com.google.gson.Gson;
import fpt.edu.vn.Backend.oauth2.exception.OAuth2AuthenticationProcessingException;
import fpt.edu.vn.Backend.oauth2.user.OAuth2UserInfo;
import fpt.edu.vn.Backend.oauth2.user.OAuth2UserInfoFactory;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Account.Role;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final Gson GSON = new Gson();
    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private AccountRepos accountRepos;
    private AttachmentRepos attachmentRepos;

    @Autowired
    public CustomOAuth2UserService(AccountRepos accountRepos, AttachmentRepos attachmentRepos) {
        this.accountRepos = accountRepos;
        this.attachmentRepos = attachmentRepos;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase();
        OAuth2UserInfo info = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, oAuth2User.getAttributes());

        if(ObjectUtils.isEmpty(info.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Account account = accountRepos.findByEmail(info.getEmail())
                .map(acc -> updateExistingUser(acc, info))
                .orElseGet(() -> {
                    return registerNewUser(oAuth2UserRequest, info);
                });
        if(!account.getProvider().equals(Account.AuthProvider.valueOf(provider))) {
            throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                    account.getProvider() + " account. Please use your " + account.getProvider() +
                    " account to login.");
        }

        log.info("- Account provider: {}", provider);
        log.info("- Id = {}, Name = {}", info.getId(), info.getName());
        log.info("- Avatar = {}", info.getImageUrl());
        log.info("- Attributes: {}", GSON.toJson(info.getAttributes()));

        OAuth2BiddifyUser oAuth2BiddifyUser = new OAuth2BiddifyUser(
                account.getEmail(),
                account.getPassword(),
                List.of(new SimpleGrantedAuthority(account.getRole().toString())),
                account.getAccountId()
        );
        oAuth2BiddifyUser.setAttributes(oAuth2User.getAttributes());
        return oAuth2BiddifyUser;
    }

    private Account registerNewUser(OAuth2UserRequest request, OAuth2UserInfo info) {
        Account account = new Account();
        log.info("Creating new OAuth2 account: {}", info.getEmail());

        account.setProvider(Account.AuthProvider.valueOf(request.getClientRegistration().getRegistrationId().toUpperCase()));
        account.setNickname(info.getName());
        account.setEmail(info.getEmail());
        account.setRole(Role.MEMBER);
        account.setPassword(RandomStringUtils.randomAlphanumeric(12));
        account.setStatus(Account.Status.ACTIVE);

        Attachment attachment = new Attachment();
        attachment.setLink(info.getImageUrl());
        attachment.setCreateDate(LocalDateTime.now());
        attachment.setUpdateDate(LocalDateTime.now());
        account.setAvatarUrl(attachment);

        return accountRepos.save(account);
    }

    private Account updateExistingUser(Account existingUser, OAuth2UserInfo info) {
        log.info("Updating existing OAuth2 account: {}", info.getEmail());
        existingUser.setNickname(info.getName());
        return accountRepos.save(existingUser);
    }
}

package fpt.edu.vn.Backend.oauth2.user;

import fpt.edu.vn.Backend.oauth2.exception.OAuth2AuthenticationProcessingException;
import fpt.edu.vn.Backend.pojo.Account;

import java.util.Map;

public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if(registrationId.equalsIgnoreCase(Account.AuthProvider.google.toString())) {
            return new GoogleOAuth2UserInfo(attributes);
        }
        else if (registrationId.equalsIgnoreCase(Account.AuthProvider.facebook.toString())) {
            return new FacebookOAuth2UserInfo(attributes);
        }
        else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }


}

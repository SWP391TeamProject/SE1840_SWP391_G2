package fpt.edu.vn.Backend.oauth2;

import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.oauth2.OAuth2GoogleUser;
import fpt.edu.vn.Backend.oauth2.OAuth2UserDetail;
import fpt.edu.vn.Backend.pojo.Account;

import java.util.Map;

public class OAuth2UserDetailFactory {
    public static OAuth2UserDetail getOAuth2UserDetail(String registrationId, Map<String,Object> attributes){
        if(registrationId.equals(Account.Provider.google)){
            return new OAuth2GoogleUser(attributes);
        }
//        else if(registrationId.equals(Account.Provider.facebook)){
//            return new OAuth2FacebookUser();
//        }
        else{
            throw new ResourceNotFoundException("1","2","3");
        }
    }

}

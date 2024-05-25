package fpt.edu.vn.Backend.oauth2;

import java.util.Map;

public class OAuth2GoogleUser extends OAuth2UserDetail {

    public OAuth2GoogleUser(Map<String,Object> attributes){
        super(attributes);
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }//3:53 utube continue
}

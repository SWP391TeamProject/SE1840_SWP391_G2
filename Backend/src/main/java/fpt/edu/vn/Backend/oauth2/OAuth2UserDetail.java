package fpt.edu.vn.Backend.oauth2;

import java.util.Map;

public abstract class OAuth2UserDetail {
    protected Map<String,Object> attributes;

    public OAuth2UserDetail(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
    public abstract String getName();
    public abstract String getEmail();//3:53 utube continue
}

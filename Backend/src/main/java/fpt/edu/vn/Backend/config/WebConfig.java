package fpt.edu.vn.Backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${FRONTEND_CORS_SERVER}")
    private  String FRONTEND_SERVER_URL;
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(FRONTEND_SERVER_URL,"http://localhost:5173/")
                .allowedMethods("GET","POST","PUT","DELETE","HEAD","PATCH")
                .allowedHeaders("Authorization", "Content-Type", "X-Auth-Token", "Access-Control-Allow-Origin")
//                .allowCredentials(true)
        ;
    }
}
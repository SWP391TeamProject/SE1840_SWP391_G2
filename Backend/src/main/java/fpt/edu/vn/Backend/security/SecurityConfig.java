package fpt.edu.vn.Backend.security;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import fpt.edu.vn.Backend.oauth2.security.*;

import fpt.edu.vn.Backend.oauth2.security.*;
import fpt.edu.vn.Backend.security.CustomUserDetailsService;
import fpt.edu.vn.Backend.security.JWTAuthEntryPoint;
import fpt.edu.vn.Backend.security.JWTAuthenticationFilter;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig {

    private CustomOAuth2UserService customOAuth2UserService;

    private JWTAuthEntryPoint jwtAuthEntryPoint;
    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Autowired
    private OAuth2AuthenticationSuccessHandler customOAuth2Success;
    @Autowired
    private OAuth2AuthenticationFailureHandler customOAuth2Failure;

    @Autowired
    public SecurityConfig(
            JWTAuthEntryPoint jwtAuthEntryPoint,
             CustomOAuth2UserService customOAuth2UserService) {
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.customOAuth2UserService = customOAuth2UserService;
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Or specify your origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(authorize -> authorize.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(authorize -> authorize.authenticationEntryPoint(jwtAuthEntryPoint))
                .httpBasic(
                        https ->
                        https.disable()
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/**","/oauth2/**","/api/auction-sessions/**","/api/items/**").permitAll()
                        .anyRequest().authenticated()

                )
                .oauth2Login(oauth2 -> oauth2
                                .authorizationEndpoint(authz -> authz
                                        .baseUri("/oauth2/authorize")
                                        .authorizationRequestRepository(cookieAuthorizationRequestRepository())
                                )
                        .redirectionEndpoint(redir -> redir
                                .baseUri("/oauth2/callback/*")
                        )
                        .tokenEndpoint(tokenEndpoint ->
                                tokenEndpoint
                                        .accessTokenResponseClient(this.accessTokenResponseClient())
                        )
                                .userInfoEndpoint(userInfo -> userInfo
                                        .userService(customOAuth2UserService)
                                )

                                .successHandler(customOAuth2Success)
                                .failureHandler(customOAuth2Failure)
                );
        http.addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }

            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return true;
            }
        };
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter() {
        return new JWTAuthenticationFilter();
    }

    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }


    @Bean
    public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient() {
        return new DefaultAuthorizationCodeTokenResponseClient();
    }



}
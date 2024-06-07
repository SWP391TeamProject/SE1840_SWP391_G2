package fpt.edu.vn.Backend.config;


import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.security.JwtHandshakeInterceptor;
import fpt.edu.vn.Backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JWTGenerator jwtGenerator;
    private final AccountService accountService;

    @Autowired
    public WebSocketConfig(JWTGenerator jwtGenerator, AccountService accountService) {
        this.jwtGenerator = jwtGenerator;
        this.accountService = accountService;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/auction-join");
        registry.addEndpoint("/auction-join")
                .addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, accountService))
                .setAllowedOrigins("http://localhost:5173");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }

}
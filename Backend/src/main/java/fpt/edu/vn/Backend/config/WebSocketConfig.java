package fpt.edu.vn.Backend.config;


import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.security.JwtHandshakeInterceptor;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JWTGenerator jwtGenerator;
    private final AccountService accountService;

    @Autowired
    private AuctionSessionService auctionSessionService;


    public void startTimeout(int id, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                auctionSessionService.finishAuction(id);
                log.info("Timeout for auction session: " + id);

            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }

    @Bean
    public ApplicationRunner applicationRunner(AuctionSessionRepos auctionSessionRepos) {
        return args -> {
            for(AuctionSession session : auctionSessionRepos.findAll()) {
                int delay = (int) (session.getEndDate().toEpochSecond(ZoneOffset.UTC) - LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
                startTimeout(session.getAuctionSessionId(), Math.max(delay, 0));
                log.info("Auction session " + session.getAuctionSessionId() + " started with delay " + Math.max(delay, 0));
            }
        };
    }
    @Autowired
    public WebSocketConfig(JWTGenerator jwtGenerator, AccountService accountService) {
        this.jwtGenerator = jwtGenerator;
        this.accountService = accountService;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/auction-join").addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, accountService)).setAllowedOrigins("http://localhost:5173");
        registry.addEndpoint("/auction-join")
                .addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, accountService))

                .setAllowedOrigins("http://localhost:5173");
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void startTimeout(String topic, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                // Code to unsubscribe the client from the topic or close the WebSocket session
                System.out.println("Timeout for topic: " + topic);
            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }
}
package fpt.edu.vn.Backend.config;


import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.security.CustomUserDetailsService;
import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.security.JwtHandshakeInterceptor;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.Scheduled;
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
    private final CustomUserDetailsService customUserDetailsService;
    private final AuctionSessionService auctionSessionService;
    private final AuctionSessionRepos auctionSessionRepos;

    @Autowired
    public WebSocketConfig(JWTGenerator jwtGenerator, CustomUserDetailsService customUserDetailsService, AuctionSessionService auctionSessionService, AuctionSessionRepos auctionSessionRepos) {
        this.jwtGenerator = jwtGenerator;
        this.customUserDetailsService = customUserDetailsService;
        this.auctionSessionService = auctionSessionService;
        this.auctionSessionRepos = auctionSessionRepos;
    }


    public void finishAuction(int id, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                auctionSessionService.finishAuction(id);
                log.info("Timeout for auction session: " + id);

            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }

    public void startAuction(int id, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                auctionSessionService.startAuction(id);
                log.info("Start auction: " + id);

            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }

    @Scheduled(fixedRate = 21600000 ,initialDelay = 0)
    public void scheduleFixedRateTask() {
        for (AuctionSession session : auctionSessionRepos.findAll()) {
            if(session.getStatus().equals(AuctionSession.Status.FINISHED) ||
                    session.getStatus().equals(AuctionSession.Status.TERMINATED)){
                continue;
            }
            if(session.getEndDate().isBefore(LocalDateTime.now())){
                finishAuction(session.getAuctionSessionId(), 1);
                log.info("Auction session " + session.getAuctionSessionId() + " finished:"+session.getEndDate());
            } else
            if(session.getStatus().equals(AuctionSession.Status.SCHEDULED)){
                int delay = (int) (session.getStartDate().toEpochSecond(ZoneOffset.UTC) - LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
                startAuction(session.getAuctionSessionId(), Math.max(delay, 0));
                log.info("Auction session " + session.getAuctionSessionId() + " start in "+delay+" seconds:"+session.getStartDate());
            } else
            if (session.getStatus().equals(AuctionSession.Status.PROGRESSING)){
                int delay = (int) (session.getEndDate().toEpochSecond(ZoneOffset.UTC) - LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
                finishAuction(session.getAuctionSessionId(), Math.max(delay, 0));
                log.info("Auction session " + session.getAuctionSessionId() + " will finish in " + Math.max(delay, 0));
            }

        }
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/auction-join").addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, customUserDetailsService)).setAllowedOrigins("http://localhost:5173");
        registry.addEndpoint("/auction-join")
                .addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, customUserDetailsService))

                .setAllowedOrigins("http://localhost:5173");
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

}
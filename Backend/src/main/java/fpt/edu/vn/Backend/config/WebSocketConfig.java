package fpt.edu.vn.Backend.config;


import fpt.edu.vn.Backend.controller.WebSocketEventListener;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.security.CustomUserDetailsService;
import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.security.JwtHandshakeInterceptor;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Set;
import java.util.concurrent.*;

@Configuration
@EnableWebSocketMessageBroker

@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    ZoneOffset zoneOffset = ZoneOffset.of("+07:00");
    private final JWTGenerator jwtGenerator;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuctionSessionService auctionSessionService;
    private final AuctionSessionRepos auctionSessionRepos;
    @Value("${FRONTEND_CORS_SERVER:}")
    private String allowedOrigins="http://localhost:5173";

    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();


    @Autowired
    public WebSocketConfig(JWTGenerator jwtGenerator, CustomUserDetailsService customUserDetailsService, AuctionSessionService auctionSessionService, AuctionSessionRepos auctionSessionRepos) {
        this.jwtGenerator = jwtGenerator;
        this.customUserDetailsService = customUserDetailsService;
        this.auctionSessionService = auctionSessionService;
        this.auctionSessionRepos = auctionSessionRepos;
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        WebSocketMessageBrokerConfigurer.super.configureWebSocketTransport(registry);

        registry.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @Override
            public WebSocketHandler decorate(WebSocketHandler webSocketHandler) {
                return new WebSocketHandlerDecorator(webSocketHandler) {
                    @Override
                    public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
                        try{
                            sessions.add(session);
                            super.afterConnectionEstablished(session);

                        } catch (Exception e){
                            log.error("Error when connection established", e);
                            session.close(CloseStatus.BAD_DATA);
                        }
                    }

                    @Override
                    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                        try{
                            //Remove the WebSocketSession object from the store
                            sessions.remove(session);
                            super.afterConnectionClosed(session, closeStatus);
                        }catch(Exception e){
                            e.printStackTrace();
                        }finally {
                            super.afterConnectionClosed(session, closeStatus);
                        }


                    }
                };
            }
        });
    }

    public void finishAuction(int id, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                try {
                    for (String topic : WebSocketEventListener.topicSessions.keySet()) {
                        log.info("Topic: " + topic);
                        if (topic.contains("/topic/public/"+id)) {
                            for (String session : WebSocketEventListener.topicSessions.get(topic)) {
                                try {
                                    for (WebSocketSession s : sessions) {
                                        if (s.getId().equals(session)) {
                                            s.close(CloseStatus.NOT_ACCEPTABLE);
                                        }
                                    }
                                } catch (Exception e) {
                                    log.error("Error when closing session", e);
                                }
                            }
                        }
                    }
                    auctionSessionService.finishAuction(id);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }

    public void startAuction(int id, int delayInSeconds) {
        final Runnable timeout = new Runnable() {
            public void run() {
                try {
                    auctionSessionService.startAuction(id);
                    AuctionSession session = auctionSessionRepos.findById(id).orElseThrow(
                            () -> new RuntimeException("Auction session not found")
                    );
                    int delay = (int) (session.getEndDate().toEpochSecond(zoneOffset) - LocalDateTime.now().toEpochSecond(zoneOffset));
                    finishAuction(session.getAuctionSessionId(), Math.max(delay, 0));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        final ScheduledFuture<?> timeoutHandle = scheduler.schedule(timeout, delayInSeconds, TimeUnit.SECONDS);
    }

    @Scheduled(fixedRate = 30000 ,initialDelay = 0)
    
    public void scheduleFixedRateTask() {
        for (AuctionSession session : auctionSessionRepos.findAll()) {
            if(session.getStatus().equals(AuctionSession.Status.FINISHED) ||
                    session.getStatus().equals(AuctionSession.Status.TERMINATED)){
                continue;
            }
            if(session.getEndDate().isBefore(LocalDateTime.now())){
                finishAuction(session.getAuctionSessionId(), 1);
            } else
            if(session.getStatus().equals(AuctionSession.Status.SCHEDULED)){
                int delay = (int) (session.getStartDate().toEpochSecond(zoneOffset) - LocalDateTime.now().toEpochSecond(zoneOffset));
                startAuction(session.getAuctionSessionId(), Math.max(delay, 0));
            } else
            if (session.getStatus().equals(AuctionSession.Status.PROGRESSING)){
                int delay = (int) (session.getEndDate().toEpochSecond(zoneOffset) - LocalDateTime.now().toEpochSecond(zoneOffset));
                finishAuction(session.getAuctionSessionId(), Math.max(delay, 0));
            }
        }
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/auction-join").addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, customUserDetailsService)).setAllowedOrigins("http://localhost:5173");
        registry.addEndpoint("/auction-join")
                .addInterceptors(new JwtHandshakeInterceptor(jwtGenerator, customUserDetailsService))

                .setAllowedOrigins(allowedOrigins,"https://biddify.fun","https://www.biddify.fun","https://biddify.southeastasia.cloudapp.azure.com","https://www.biddify.southeastasia.cloudapp.azure.com","http://localhost:5173");
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

}
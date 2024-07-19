package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component

public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;
    @Autowired
    private AuctionSessionRepos auctionSessionRepos;

    public static Map<String, Set<String>> topicSessions = new ConcurrentHashMap<>();


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info(" a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            logger.info("User Disconnected : " + username);
        }
    }


    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String topic = headerAccessor.getDestination();
        logger.info("User subscribed to : " + topic);
        if (!topicSessions.containsKey(topic)) {
            Set<String> sessions = ConcurrentHashMap.newKeySet();
            sessions.add(headerAccessor.getSessionId());
            topicSessions.put(topic, sessions);
        } else
            topicSessions.get(topic).add(headerAccessor.getSessionId());
        String[] args = topic.split("/");

        Optional<AuctionSession> as = auctionSessionRepos.findById(Integer.parseInt(args[3])); 
        if (as.isEmpty()) {
            logger.info("Auction session not found");
            messagingTemplate.convertAndSend("/topic/public/" + args[3] + "/" + args[4], "Auction session not found:0:ERROR");
        } else if (as.get().getStatus() == AuctionSession.Status.FINISHED) {
            logger.info("Auction session ended");
            messagingTemplate.convertAndSend("/topic/public/" + args[3] + "/" + args[4], "Auction session has ended:0:ERROR");
        } else if (as.get().getStatus() == AuctionSession.Status.SCHEDULED) {
            logger.info("Auction session not started");
            messagingTemplate.convertAndSend("/topic/public/" + args[3] + "/" + args[4], "Auction session not started:0:ERROR");
        }
    }
}
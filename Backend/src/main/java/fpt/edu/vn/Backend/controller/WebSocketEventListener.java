package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
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

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;
    @Autowired
    private AuctionSessionService auctionSessionService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null) {
            logger.info("User Disconnected : " + username);
        }
    }



    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String topic = headerAccessor.getDestination();
        logger.info("User subscribed to : " + topic);
        assert topic != null;
        if(auctionSessionService.getAuctionSessionById(Integer.parseInt(topic.split("/")[3])) == null) {
            logger.info("Auction session not found");
            messagingTemplate.convertAndSend("/topic/public/" + topic.split("/")[3]+"/"+ topic.split("/")[4], "Auction session not found:0:ERROR");
//            throw new ResourceNotFoundException("Auction session not found");
        }
        else if(auctionSessionService.getAuctionSessionById(Integer.parseInt(topic.split("/")[3])).getStatus().equalsIgnoreCase("FINISHED")) {
            logger.info("Auction session ended");
            messagingTemplate.convertAndSend("/topic/public/" + topic.split("/")[3]+"/"+ topic.split("/")[4], "Auction session has ended:0:ERROR");
//            throw new ResourceNotFoundException("Auction session has ended");

        }
        else if(auctionSessionService.getAuctionSessionById(Integer.parseInt(topic.split("/")[3])).getStatus().equalsIgnoreCase("SCHEDULED")) {
            logger.info("Auction session not started");
            messagingTemplate.convertAndSend("/topic/public/" + topic.split("/")[3]+"/"+ topic.split("/")[4], "Auction session not started:0:ERROR");
//            throw new ResourceNotFoundException("Auction session not started");

        }
    }
}
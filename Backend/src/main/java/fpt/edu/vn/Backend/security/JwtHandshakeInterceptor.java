package fpt.edu.vn.Backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger log = LoggerFactory.getLogger(JwtHandshakeInterceptor.class);
    private final JWTGenerator jwtGenerator;
    private CustomUserDetailsService customUserDetailService;

    public JwtHandshakeInterceptor(JWTGenerator jwtGenerator, CustomUserDetailsService customUserDetailService) {
        this.jwtGenerator = jwtGenerator;
        this.customUserDetailService = customUserDetailService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // Extract the JWT from the request URL
        String jwt = extractJwtFromRequest(request);

        // Validate the JWT and perform authentication
        if (jwtGenerator.validateToken(jwt)) {
            String email = jwtGenerator.getEmailFromToken(jwt);
            UserDetails userDetails = customUserDetailService.loadUserByUsername(email);
            if (userDetails != null) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        userDetails.getPassword(),
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                attributes.put("username", email);
                return true;
            } else {
                return false;
            }

            // You can store the username or other user details in the WebSocket session attributes

        } else {
            // If the JWT is not valid, reject the handshake by returning false
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    }

    private String extractJwtFromRequest(ServerHttpRequest request) {
        // Extract the JWT from the request URL
        String query = request.getURI().getQuery();
        String[] parts = query.split("token=");
        if (parts.length > 1) {
            return parts[1];
        } else {
            return null;
        }
    }
}
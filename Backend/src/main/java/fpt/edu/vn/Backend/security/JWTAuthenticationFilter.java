package fpt.edu.vn.Backend.security;

import com.nimbusds.jwt.SignedJWT;
import fpt.edu.vn.Backend.DTO.request.RefreshRequest;
import fpt.edu.vn.Backend.DTO.response.AuthenticationResponse;
import fpt.edu.vn.Backend.oauth2.security.RefreshTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);
    @Autowired
    private JWTGenerator jwtGenerator;
    @Autowired
    private CustomUserDetailsService customUserDetailService;
    @Autowired
    private RefreshTokenProvider refreshTokenProvider;
    private static final long REFRESH_THRESHOLD = 5 * 60 * 1000;
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String token = getJWTFromRequest(request);
            if (StringUtils.hasText(token) && jwtGenerator.validateToken(token)) {
                String email = jwtGenerator.getEmailFromToken(token);
                UserDetails userDetails = customUserDetailService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,   // password
                        userDetails.getAuthorities()
                );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                Claims claims = Jwts.parserBuilder().setSigningKey(jwtGenerator.getSigningKey()).build().parseClaimsJws(token).getBody();
                Date expirationDate = claims.getExpiration();
                long currentTimeMillis = System.currentTimeMillis();
                long expirationTimeMillis = expirationDate.getTime();
                if(expirationTimeMillis - currentTimeMillis <= REFRESH_THRESHOLD){
                    RefreshRequest refresh = new RefreshRequest();
                    refresh.setToken(token);
                    AuthenticationResponse refreshToken = refreshTokenProvider.refreshToken(refresh);
                    sendJWTFromResponse(response,refreshToken.getAccessToken());
                }

            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        filterChain.doFilter(request, response);
    }

    private void sendJWTFromResponse(HttpServletResponse response,String refreshToken){
        response.setHeader("Authorization", "Bearer " + refreshToken);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // System.out.println("accessToken: " + bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
package fpt.edu.vn.Backend.oauth2.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import fpt.edu.vn.Backend.DTO.request.IntrospectRequest;
import fpt.edu.vn.Backend.DTO.request.LogOutRequest;
import fpt.edu.vn.Backend.DTO.request.RefreshRequest;
import fpt.edu.vn.Backend.DTO.response.AuthenticationResponse;
import fpt.edu.vn.Backend.DTO.response.IntrospectResponse;
import fpt.edu.vn.Backend.oauth2.exception.AppException;
import fpt.edu.vn.Backend.oauth2.exception.ErrorCode;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Token;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.TokenRepos;
import fpt.edu.vn.Backend.security.SecurityConstants;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import java.util.Optional;
import java.util.StringJoiner;
import java.util.UUID;

@Service
public class TokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Autowired
    private TokenRepos tokenRepos;

    @Autowired
    private AccountRepos accountRepos;

    private Key getSigningKey() {
        byte[] keyBytes = SecurityConstants.JWT_SECRET.getBytes(
                StandardCharsets.UTF_8
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailFromToken(String token) {
        Claims claims =
                Jwts.parser()
                        .setSigningKey(getSigningKey())
                        .parseClaimsJws(token)
                        .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts
                    .parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }



    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (tokenRepos.existsByToken(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        return signedJWT;
    }
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Scheduled(fixedRate = 8000000) //every 80 minute will auto clean
    @Transactional
    public void cleanupExpiredTokens() {
        Date now = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        tokenRepos.deleteByExpiryTimeBefore(now);
        System.out.println("Expired tokens cleaned up at " + new Date());
    }
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);
        var email = signedJWT.getJWTClaimsSet().getSubject();

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        Token tokens =
                Token.builder()
                        .token(jit)
                        .expiryTime(expiryTime)
                        .tokenType("Bearer")
                        .build();

        tokenRepos.save(tokens);



        var user =
                accountRepos.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateRefreshToken(user);

        return AuthenticationResponse.builder().accessToken(token).authenticated(true).build();
    }

    private String generateRefreshToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getEmail())
                .issuer("Biddify.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            logger.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }
    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        String role = String.valueOf(account.getRole());
        stringJoiner.add("ROLE_" + role);
        return stringJoiner.toString();
    }
}

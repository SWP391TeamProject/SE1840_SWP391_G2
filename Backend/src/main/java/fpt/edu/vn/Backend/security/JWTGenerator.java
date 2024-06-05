package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.security.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

@Component
public class JWTGenerator {

	private Key getSigningKey() {
		byte[] keyBytes = SecurityConstants.JWT_SECRET.getBytes(
				StandardCharsets.UTF_8
		);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(Authentication authentication) {
		String email = authentication.getName();
		Date currentDate = new Date();
		Date expireDate = new Date(
				currentDate.getTime() + SecurityConstants.JWT_EXPIRATION
		);
        return Jwts
				.builder()
				.setHeaderParam("typ", "JWT")
				.claim(
						"authorities",
						authentication.getAuthorities().stream()
								.map(GrantedAuthority::getAuthority)
								.collect(Collectors.toList())
				)
				.setSubject(email)
				.setIssuedAt(currentDate)
				.setExpiration(expireDate)
				.setId(UUID.randomUUID().toString())
				.signWith(getSigningKey(), SignatureAlgorithm.HS512)
				.compact();
	}



	public String getEmailFromToken(String token) {
		Claims claims = Jwts
				.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}

	public boolean validateToken(String token) {
		try {
			Jwts
					.parserBuilder()
					.setSigningKey(getSigningKey())
					.build()
					.parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			throw new AuthenticationCredentialsNotFoundException(
					"JWT expired or incorrect!"
			);
		}
	}
}
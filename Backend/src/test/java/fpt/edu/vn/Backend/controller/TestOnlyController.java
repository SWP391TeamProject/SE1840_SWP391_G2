package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.exception.*;
import fpt.edu.vn.Backend.oauth2.exception.OAuth2AuthenticationProcessingException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test-only")
public class TestOnlyController {
    @GetMapping("/resourceNotFound")
    public void testResourceNotFoundException() {
        throw new ResourceNotFoundException("Resource not found");
    }

    @GetMapping("/invalidInput")
    public void testInvalidInputException() {
        throw new InvalidInputException("Invalid input provided");
    }

    @GetMapping("/consignmentService")
    public void testConsignmentServiceException() {
        throw new ConsignmentServiceException("Consignment service exception occurred");
    }

    @GetMapping("/cooldown")
    public void testCooldownException() {
        throw new CooldownException("Cooldown exception occurred");
    }

    @GetMapping("/authorization")
    public void testAuthorizationException() {
        throw new AuthorizationException("Authorization failed");
    }

    @GetMapping("/illegalState")
    public void testIllegalStateException() {
        throw new IllegalStateException("Illegal state detected");
    }

    @GetMapping("/illegalArgument")
    public void testIllegalArgumentException() {
        throw new IllegalArgumentException("Illegal argument provided");
    }

    @GetMapping("/jwt")
    public void testJwtException() {
        //throw new JwtException("JWT token exception");
    }

    @GetMapping("/oauth2")
    public void testOAuth2AuthenticationProcessingException() {
        throw new OAuth2AuthenticationProcessingException("OAuth2 authentication exception");
    }
}
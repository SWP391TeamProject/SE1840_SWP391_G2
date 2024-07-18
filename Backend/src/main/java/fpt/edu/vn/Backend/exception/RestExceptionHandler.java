package fpt.edu.vn.Backend.exception;

import fpt.edu.vn.Backend.oauth2.exception.OAuth2AuthenticationProcessingException;
import io.jsonwebtoken.JwtException;
import jdk.jfr.Description;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@RestController
@ControllerAdvice
@Description("Handle all exceptions")
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
  private static final HttpHeaders HEADERS = new HttpHeaders();

  static {
    HEADERS.setContentType(MediaType.APPLICATION_JSON);
  }
  
  private String extractMessage(Exception ex) {
    String message = ex.getMessage();
    int colonIndex = message.indexOf(':');
    return (colonIndex != -1) ? message.substring(colonIndex + 1).trim() : message;
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFoundException(Exception ex, WebRequest request) {
    ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(), new Date());
    return handleExceptionInternal(ex, error, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(InvalidInputException.class)
  public ResponseEntity<Object> handleBadRequestException(Exception ex, WebRequest request) {
    ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), extractMessage(ex), new Date());
    return handleExceptionInternal(ex, error, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(ConsignmentServiceException.class)
  public ResponseEntity<Object> handleConsignmentServiceException(ConsignmentServiceException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(CooldownException.class)
  public ResponseEntity<Object> handleConsignmentServiceException(CooldownException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(MappingException.class)
  public ResponseEntity<Object> handleMappingException(MappingException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(AuthorizationException.class)
  public ResponseEntity<Object> handleAuthorizationException(AuthorizationException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.UNAUTHORIZED, request);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<Object> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(JwtException.class)
  public ResponseEntity<Object> handleJwtException(JwtException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.UNAUTHORIZED, request);
  }

  @ExceptionHandler(OAuth2AuthenticationProcessingException.class)
  public ResponseEntity<Object> handleJwtException(OAuth2AuthenticationProcessingException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.BAD_REQUEST, request);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(),ex.getMessage(),new Date());
    return handleExceptionInternal(ex, errorResponse, HEADERS, HttpStatus.UNAUTHORIZED, request);
  }

}

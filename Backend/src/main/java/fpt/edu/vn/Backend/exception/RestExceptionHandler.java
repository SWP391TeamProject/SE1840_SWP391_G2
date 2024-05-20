package fpt.edu.vn.Backend.exception;

import java.util.Date;

import jdk.jfr.Description;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestController
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(value = ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFoundException(Exception ex) {
    ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(), new Date());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }


  @ExceptionHandler(value = InvalidInputException.class)
  public ResponseEntity<Object> handleBadRequestException(Exception ex) {
    ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(), new Date());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConsignmentServiceException.class)
  public ResponseEntity<ErrorResponse> handleConsignmentServiceException(ConsignmentServiceException ex) {
    ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage(),new Date());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST); // Or appropriate status
  }
}

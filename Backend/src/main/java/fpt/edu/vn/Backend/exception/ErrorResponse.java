package fpt.edu.vn.Backend.exception;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ErrorResponse {
  private int status;
  private String message;
  private Date timestamp;
}

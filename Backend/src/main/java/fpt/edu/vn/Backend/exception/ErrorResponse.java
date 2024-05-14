package com.fptgang.auctionhouse.exception;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ErrorResponse {
  private int  status;
  private String message;
  private Date timestamp;

  public ErrorResponse(int status, String message, Date timestamp) {
    this.status = status;
    this.message = message;
    this.timestamp = timestamp;
  }
}

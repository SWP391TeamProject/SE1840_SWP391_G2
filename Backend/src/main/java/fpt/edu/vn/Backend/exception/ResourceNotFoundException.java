package com.fptgang.auctionhouse.exception;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException() {
    super();
  }

  public ResourceNotFoundException(String model, String field, String value) {
    super(String.format("%s with %s %s is not existed", model, field, value));
  }

  public ResourceNotFoundException(String message) {
    super(message);
  }

  public ResourceNotFoundException(Throwable cause) {
    super(cause);
  }

  public ResourceNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}

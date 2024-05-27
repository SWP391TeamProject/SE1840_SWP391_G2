package fpt.edu.vn.Backend.exception;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException() {
    super();
  }

  public ResourceNotFoundException(String model, String field, Object value) {
    super(String.format("%s with %s %s is not existed", model, field, value.toString()));
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

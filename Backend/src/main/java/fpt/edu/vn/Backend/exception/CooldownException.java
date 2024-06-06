package fpt.edu.vn.Backend.exception;

public class CooldownException extends RuntimeException {

    public CooldownException() {}

    public CooldownException(String message) {
        super(message);
    }

    public CooldownException(Throwable cause) {
        super(cause);
    }

    public CooldownException(String message, Throwable cause) {
        super(message, cause);
    }
}

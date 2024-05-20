package fpt.edu.vn.Backend.exception;

public class ConsignmentServiceException extends RuntimeException {

    public ConsignmentServiceException(String message) {
        super(message);
    }

    public ConsignmentServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

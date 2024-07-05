package fpt.edu.vn.Backend.exception;

public class PaypalRequestException extends RuntimeException {
    public PaypalRequestException(String e) {
        super(e);
    }
}

package fpt.edu.vn.Backend.exception;

public class ItemServiceException extends RuntimeException{

        public ItemServiceException() {
        }

        public ItemServiceException(String message) {
            super(message);
        }

        public ItemServiceException(Throwable cause) {
            super(cause);
        }

        public ItemServiceException(String message, Throwable cause) {
            super(message, cause);
        }
}

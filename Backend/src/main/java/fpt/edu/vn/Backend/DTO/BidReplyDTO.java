package fpt.edu.vn.Backend.DTO;

import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BidReplyDTO implements Serializable {
    private String id;
    private String message;
    private BigDecimal currentPrice;
    private Status status;

    public BidReplyDTO(String message, BigDecimal amount, Status status) {
        this.message = message;
        this.currentPrice = amount;
        this.status = status;
    }

    public BidReplyDTO(String message, Status status) {
        this.message = message;
        this.status = status;
    }

    public enum Status {
        JOIN,
        ERROR,
        BID
    }
}

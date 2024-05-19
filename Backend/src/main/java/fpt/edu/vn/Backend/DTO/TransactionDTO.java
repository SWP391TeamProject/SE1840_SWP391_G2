package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Transaction;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class TransactionDTO {
    private int transId;
    private String type;
    private int userId;
    private BigDecimal amount;
    private String content;
    private Integer referenceNum;
    private String paymentMethod;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    TransactionDTO(Transaction transaction) {
        this.transId = transaction.getTransId();
        this.type = transaction.getType();
        this.userId = transaction.getUser().getUserId();
        this.amount = transaction.getAmount();
        this.content = transaction.getContent();
        this.referenceNum = transaction.getReferenceNum();
        this.paymentMethod = transaction.getPaymentMethod();
        this.status = transaction.getStatus();
        this.createDate = transaction.getCreateDate();
        this.updateDate = transaction.getUpdateDate();
    }
    // getters and setters
    // ...
}
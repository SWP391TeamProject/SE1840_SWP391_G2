package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class NotificationDTO implements Serializable {
    private int notificationId;
    private int userId;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public NotificationDTO(Notification notification) {
        this.notificationId = notification.getNotificationId();
        this.userId = notification.getAccount().getAccountId();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.isRead = notification.isRead();
        this.createDate = notification.getCreateDate();
        this.updateDate = notification.getUpdateDate();
    }
}
package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Notification;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class NotificationDTO {
    private int notificationId;
    private int userId;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    NotificationDTO(Notification notification)
    {
        this.notificationId = notification.getNotificationId();
        this.userId = notification.getUser().getUserId();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.isRead = notification.isRead();
        this.createDate = notification.getCreateDate();
        this.updateDate = notification.getUpdateDate();
    }
    // getters and setters
    // ...
}
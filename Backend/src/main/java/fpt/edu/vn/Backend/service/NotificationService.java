package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    boolean markNotificationRead(int notificationId, String userEmail) throws IllegalAccessException;

    @NotNull NotificationDTO sendNotification(@NotNull NotificationDTO dto);

    @NotNull Page<NotificationDTO> getNotifications(@NotNull Pageable pageable, String userEmail);

    int countUnreadNotifications(String userEmail);
}

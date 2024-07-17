package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Notification;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    Notification mapDTOToEntity(NotificationDTO dto);

    boolean markNotificationRead(int notificationId, String userEmail) throws IllegalAccessException;

    @NotNull NotificationDTO sendNotification(@NotNull NotificationDTO dto);

    void sendBulkNotification(@NotNull List<NotificationDTO> notifications);

    void sendNotificationToMultiUsers(@NotNull NotificationDTO dto, Account... accounts);

    void sendNotificationToUserGroup(@NotNull NotificationDTO dto, @NotNull Account.Role... roles);

    @NotNull default NotificationDTO sendNotification(@NotNull String message, @NotNull Integer account) {
        return sendNotification(NotificationDTO.builder().message(message).userId(account).build());
    }

    default void sendNotificationToMultiUsers(@NotNull String message, Account... accounts) {
        sendNotificationToMultiUsers(NotificationDTO.builder().message(message).build(), accounts);
    }

    default void sendNotificationToUserGroup(@NotNull String message, @NotNull Account.Role... roles) {
        sendNotificationToUserGroup(NotificationDTO.builder().message(message).build(), roles);
    }

    @NotNull Page<NotificationDTO> getNotifications(@NotNull Pageable pageable, String userEmail);

    int countUnreadNotifications(String userEmail);
    void sendInvitationToAllMembers(int auctionSessionId);
}

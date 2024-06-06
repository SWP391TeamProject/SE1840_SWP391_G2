package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.NotificationRepos;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepos notificationRepos;
    private final AccountRepos accountRepos;

    @Autowired
    public NotificationServiceImpl(NotificationRepos notificationRepos, AccountRepos accountRepos) {
        this.notificationRepos = notificationRepos;
        this.accountRepos = accountRepos;
    }

    @Override
    public boolean markNotificationRead(int notificationId, String userEmail) throws IllegalAccessException {
        Notification notification = notificationRepos.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "notificationId", notificationId));
        if (!Objects.equals(notification.getAccount().getEmail(), userEmail))
            throw new IllegalAccessException("Permission denied");
        if (notification.isRead())
            return false;
        notification.setRead(true);
        return true;
    }

    @Override
    public @NotNull NotificationDTO sendNotification(@NotNull NotificationDTO dto) {
        Account acc = accountRepos.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", dto.getUserId()));

        Notification noti = new Notification();
        noti.setAccount(acc);
        noti.setRead(dto.isRead());
        noti.setMessage(dto.getMessage());
        noti.setType(dto.getType());

        return new NotificationDTO(notificationRepos.save(noti));
    }

    @Override
    public @NotNull Page<NotificationDTO> getNotifications(@NotNull Pageable pageable, String userEmail) {
        return notificationRepos.findNotificationByAccount_EmailOrderByCreateDateDesc(userEmail, pageable)
                .map(NotificationDTO::new);
    }
}

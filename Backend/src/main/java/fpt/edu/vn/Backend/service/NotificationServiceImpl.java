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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
        notificationRepos.save(notification);
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
    @Transactional
    public @NotNull NotificationDTO sendNotificationToAllMembers(@NotNull NotificationDTO dto){
        List<Account> memberAccounts = accountRepos.findByRole(Account.Role.MEMBER);
        for (Account account : memberAccounts) {
            Notification notification = new Notification();
            notification.setAccount(account);
            notification.setMessage(dto.getMessage());
            notification.setType(dto.getType());
            notification.setRead(dto.isRead());
            notificationRepos.save(notification);
        }
        return dto;
    }

    @Override
    public @NotNull Page<NotificationDTO> getNotifications(@NotNull Pageable pageable, String userEmail) {
        return notificationRepos.findNotificationByAccount_EmailOrderByCreateDateDesc(userEmail, pageable)
                .map(NotificationDTO::new);
    }

    @Override
    public int countUnreadNotifications(String userEmail) {
        return notificationRepos.countAllByAccount_EmailAndReadIsFalse(userEmail);
    }
}

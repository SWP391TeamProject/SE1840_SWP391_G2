package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.repository.NotificationRepos;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);
    private final NotificationRepos notificationRepos;
    private final AccountRepos accountRepos;
    private final AuctionSessionRepos auctionSessionRepos;

    @Autowired
    public NotificationServiceImpl(NotificationRepos notificationRepos, AccountRepos accountRepos, AuctionSessionRepos auctionSessionRepos) {
        this.notificationRepos = notificationRepos;
        this.accountRepos = accountRepos;
        this.auctionSessionRepos = auctionSessionRepos;
    }
    @Transactional
    @Override
    public Notification mapDTOToEntity(NotificationDTO dto) {
        Account acc = accountRepos.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", dto.getUserId()));
        Notification noti = new Notification();
        noti.setAccount(acc);
        noti.setRead(dto.isRead());
        noti.setMessage(dto.getMessage());
        return noti;
    }
    @Transactional
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
    @Transactional
    @Override
    public @NotNull NotificationDTO sendNotification(@NotNull NotificationDTO dto) {
        return new NotificationDTO(notificationRepos.save(mapDTOToEntity(dto)));
    }
    @Transactional
    @Override
    public void sendBulkNotification(@NotNull List<NotificationDTO> notifications) {
        notificationRepos.saveAll(notifications.stream().map(this::mapDTOToEntity).collect(Collectors.toList()));
    }
    @Transactional
    @Override
    public void sendNotificationToMultiUsers(@NotNull NotificationDTO dto, Account... accounts) {
        notificationRepos.saveAll(Arrays.stream(accounts).map(account -> {
            Notification notification = mapDTOToEntity(dto);
            notification.setAccount(account);
            return notification;
        }).collect(Collectors.toList()));
    }

    @Override
    @Transactional
    public void sendNotificationToUserGroup(@NotNull NotificationDTO dto, @NotNull Account.Role... roles) {
        notificationRepos.saveAll(Arrays.stream(roles)
                .map(accountRepos::findByRole)
                .flatMap(List::stream)
                .map(account -> {
                    dto.setUserId(account.getAccountId());
                    Notification notification = mapDTOToEntity(dto);
                    notification.setAccount(account);
                    return notification;
                }).collect(Collectors.toList()));
    }
    @Transactional
    @Override
    public @NotNull Page<NotificationDTO> getNotifications(@NotNull Pageable pageable, String userEmail) {
        return notificationRepos.findNotificationByAccount_EmailOrderByCreateDateDesc(userEmail, pageable)
                .map(NotificationDTO::new);
    }
    @Transactional
    @Override
    public int countUnreadNotifications(String userEmail) {
        return notificationRepos.countAllByAccount_EmailAndReadIsFalse(userEmail);
    }
    @Transactional
    @Override
    public void sendInvitationToAllMembers(int auctionSessionId) {
        List<Account> members = accountRepos.findAll();
        Optional<AuctionSession> auction = auctionSessionRepos.findById(auctionSessionId);
        AuctionSession auctionSession = auction.get();

        String auctionLink = "https://biddify/api/auction-sessions/" + auctionSessionId;
        String message = "You are invited to join the auction for " + auctionSession.getTitle() + "! Click the link to participate: " + auctionLink;

        for (Account account : members) {
            Notification notification = new Notification();
            notification.setAccount(account);
            notification.setMessage(message);
            notification.setRead(false);
            notification.setCreateDate(LocalDateTime.now());
            notification.setUpdateDate(LocalDateTime.now());
            notificationRepos.save(notification);
        }
    }

}

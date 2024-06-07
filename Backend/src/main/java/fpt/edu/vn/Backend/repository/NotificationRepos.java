package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepos extends JpaRepository<Notification, Integer> {
    Page<Notification> findNotificationByAccount_EmailOrderByCreateDateDesc(String userEmail, Pageable pageable);
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.account.email = :email AND n.isRead = false")
    int countAllByAccount_EmailAndReadIsFalse(@Param("email") String userEmail);
}

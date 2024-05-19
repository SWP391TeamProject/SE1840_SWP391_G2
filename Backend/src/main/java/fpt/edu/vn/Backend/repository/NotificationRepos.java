package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepos extends JpaRepository<Notification, Integer> {
}

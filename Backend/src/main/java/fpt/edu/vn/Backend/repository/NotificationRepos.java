package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(collectionResourceRel = "notifications", path = "notifications")
public interface NotificationRepos extends PagingAndSortingRepository<Notification, Integer> {

}

package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Repository
public interface InvalidatedTokenRepos extends JpaRepository<InvalidatedToken, String> {
    @Transactional
    void deleteByExpiryTimeBefore(Date now);

}

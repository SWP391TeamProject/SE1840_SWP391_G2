package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Repository
public interface TokenRepos extends JpaRepository<Token, String> {
    @Transactional
    void deleteByExpiryTimeBefore(Date now);
    boolean existsByToken(String token);
}

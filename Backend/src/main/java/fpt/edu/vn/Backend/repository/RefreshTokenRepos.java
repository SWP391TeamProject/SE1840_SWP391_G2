package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

@Repository
public interface RefreshTokenRepos extends JpaRepository<RefreshToken, String> {
    @Transactional
    void deleteByExpiryTimeBefore(Date now);
    boolean existsByRefreshToken(String token);

    Optional<RefreshToken> findByAccount(Account account);
}

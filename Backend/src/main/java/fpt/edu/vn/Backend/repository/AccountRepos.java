package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AccountRepos extends JpaRepository<Account, Integer> {
    @Query("SELECT a FROM Account a WHERE a.role IN :roles")
    @Nullable
    Page<Account> findByRoleIn(Set<Account.Role> roles, Pageable pageable);

    Optional<Account> findByEmail(String email);


    Optional<Account> findByEmailAndPassword(String email, String password);

    @Query("SELECT a FROM Account a WHERE a.nickname LIKE %:name% OR a.email LIKE %:name%")
    Page<Account> findByNicknameContainingOrEmailContaining(String name, Pageable pageable);

    Optional<Account> findByAccountId(int accountId);

    Optional<Account> findByAccountIdAndPassword(int accountId, String password);

    @Query("SELECT a.balance FROM Account a WHERE a.updateDate = (SELECT MAX(a2.updateDate) FROM Account a2 WHERE a2.updateDate <= :date)")
    BigDecimal findBalanceByDate(@Param("date") LocalDateTime date);

    @Query("SELECT MONTH(a.createDate), COUNT(a) FROM Account a WHERE YEAR(a.createDate) = :year AND a.status = 'ACTIVE' AND a.role = 'MEMBER' GROUP BY MONTH(a.createDate)")
    List<Object[]> findNewUsersByMonth(int year);
}



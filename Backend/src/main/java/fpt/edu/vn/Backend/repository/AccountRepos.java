package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface AccountRepos extends JpaRepository<Account, Integer> {
    @Query("SELECT a FROM Account a JOIN a.roles r WHERE r IN :roles")
    @Nullable
    Page<Account> findAccountByAuthoritiesRoles(Set<Account.Role> roles, Pageable pageable);

    Optional<Account> findByEmail(String email);

    Optional<Account> findByEmailAndPassword(String email, String password);
}

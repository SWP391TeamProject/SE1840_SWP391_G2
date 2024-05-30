package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Item;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface AccountRepos extends JpaRepository<Account, Integer> {
    @Query("SELECT a FROM Account a JOIN a.authorities r WHERE r.roleId IN :roleIds")
    @Nullable
    Page<Account> findAccountByAuthoritiesRoleIds(Set<Integer> roleIds, Pageable pageable);

    Optional<Account> findByEmail(String email);

    Optional<Account> findByEmailAndPassword(String email, String password);
}

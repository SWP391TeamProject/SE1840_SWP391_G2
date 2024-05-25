package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AccountRepos extends JpaRepository<Account, Integer>{
    Optional<Account> findByEmail(String email);

    Account findByEmailAndPassword(String email, String password);

    Account findAccountByEmail(String email);

    Optional<Account> findAccountByEmailAndProvider(String email, String provideId);
}

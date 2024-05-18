package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountRepos extends JpaRepository<Account, Integer>{
    Account findByEmail(String email);

    Account findByEmailAndPassword(String email, String password);

    Account findAccountByEmail(String email);
}

package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface AccountRepos extends JpaRepository<Account, Integer>{
    Account findByUsername(String username);
    Account findByEmail(String email);
    Account findByUsernameAndPassword(String username, String password);
    Account findByEmailAndPassword(String email, String password);


}

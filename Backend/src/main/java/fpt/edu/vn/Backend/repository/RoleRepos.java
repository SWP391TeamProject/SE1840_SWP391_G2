package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepos extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(Role.Group roleName);
}

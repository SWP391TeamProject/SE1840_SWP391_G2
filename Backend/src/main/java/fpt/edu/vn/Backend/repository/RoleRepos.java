package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepos extends JpaRepository<Role, Integer> {
}

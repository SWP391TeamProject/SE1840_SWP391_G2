package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Consignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsignmentRepos extends JpaRepository<Consignment, Integer> {

}

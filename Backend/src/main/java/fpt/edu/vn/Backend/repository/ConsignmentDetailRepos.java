package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsignmentDetailRepos extends JpaRepository<ConsignmentDetail, Integer> {
}

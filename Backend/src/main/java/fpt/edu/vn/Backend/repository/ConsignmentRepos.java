package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Consignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsignmentRepos extends JpaRepository<Consignment, Integer> {
    Page<Consignment> findByConsignmentId(int id, Pageable pageable);

    Consignment findByConsignmentId(int id);

    Page<Consignment> findByStatus(Consignment.Status status, Pageable pageable);

}

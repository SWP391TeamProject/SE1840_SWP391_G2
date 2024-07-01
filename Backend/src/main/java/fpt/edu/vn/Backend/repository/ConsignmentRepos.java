package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Consignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsignmentRepos extends JpaRepository<Consignment, Integer> {
    Page<Consignment> findByConsignmentId(int id, Pageable pageable);

    Consignment findByConsignmentId(int id);

    Page<Consignment> findByStatus(Consignment.Status status, Pageable pageable);
    Page<Consignment> findByStatusAndStaff_AccountId(Consignment.Status status,int accID, Pageable pageable);
    @Query("SELECT c FROM Consignment c JOIN c.consignmentDetails cd WHERE cd.account.accountId = ?1")
    Page<Consignment> findByUserID(int userId, Pageable pageable);
}

package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsignmentDetailRepos extends JpaRepository<ConsignmentDetail, Integer> {
    List<ConsignmentDetail> findByConsignmentId(int consignmentId);
    Account findByAccount_AccountId(int accountId);
}

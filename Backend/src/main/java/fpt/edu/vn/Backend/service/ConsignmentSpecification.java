package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ConsignmentSpecification implements Specification<Consignment> {
    private final String keyword;

    public ConsignmentSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Consignment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if(keyword == null || keyword.isEmpty()){
            return criteriaBuilder.conjunction();
        }
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(root.get("consignmentId").as(String.class),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("preferContact"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate").as(String.class), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("status").as(String.class), "%" + keyword +"%"));


        Join<Consignment, Account> joinUser = root.join("user", JoinType.LEFT);
        Join<Consignment, Account> joinStaff = root.join("staff", JoinType.LEFT);

        predicates.add(criteriaBuilder.or(
                criteriaBuilder.isNull(joinUser.get("accountId")),
                criteriaBuilder.like(joinUser.get("nickname"), "%" + keyword + "%")
        ));
        predicates.add(criteriaBuilder.or(
                criteriaBuilder.isNull(joinStaff.get("accountId")),
                criteriaBuilder.like(joinStaff.get("nickname"), "%" + keyword + "%")
        ));
        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

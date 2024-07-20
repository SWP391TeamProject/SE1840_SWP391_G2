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
        Join<Consignment, Account> joinStaff = root.join("staff", JoinType.LEFT);
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(criteriaBuilder.like(root.get("preferContact"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate").as(String.class), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("updateDate").as(String.class), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("status").as(String.class), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("gemstone"), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("measurement"), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("condition"), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("stamped"), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(root.get("metal"), "%" + keyword +"%"));
        predicates.add(criteriaBuilder.like(joinStaff.get("nickname"), "%" + keyword +"%"));

        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

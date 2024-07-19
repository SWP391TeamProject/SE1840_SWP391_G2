package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AccountSpecification implements Specification<Account> {
    private final String keyword;

    public AccountSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Account> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if(keyword == null || keyword.isEmpty()){
            return criteriaBuilder.conjunction();
        }
        List<Predicate> predicate = new ArrayList<>();
        predicate.add(criteriaBuilder.like(root.get("email"),"%" + keyword + "%"));
        predicate.add(criteriaBuilder.like(root.get("phone"), "%" + keyword + "%"));
        predicate.add(criteriaBuilder.like(root.get("role"),"%" + keyword +"%"));
        predicate.add(criteriaBuilder.like(root.get("status"),"%"+keyword+"%"));

        return criteriaBuilder.or(predicate.toArray(new Predicate[0]));
    }
}

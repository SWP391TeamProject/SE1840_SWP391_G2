package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Order;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification implements Specification<Order> {
    private final String keyword;

    public OrderSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Order> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if(keyword.isEmpty() || keyword == null)
            return criteriaBuilder.conjunction();
        Join<Order, Account> joinAccount = root.join("account",JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(root.get("shippingAddress"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("shippingStatus"),"%" + keyword + "%"));
//        predicates.add(criteriaBuilder.like(root.get("shippingAddress"),"%" + keyword + "%"));
//        predicates.add(criteriaBuilder.like(root.get("shippingAddress"),"%" + keyword + "%"));
        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

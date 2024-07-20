package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.Payment;
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
        Join<Order, Payment> joinPayment = root.join("payment", JoinType.LEFT);
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(root.get("orderId").as(String.class),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("shippingAddress"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinPayment.get("status"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinPayment.get("createDate").as(String.class),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinPayment.get("accountId").as(String.class),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinPayment.get("paymentAmount").as(String.class),"%" + keyword + "%"));

        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

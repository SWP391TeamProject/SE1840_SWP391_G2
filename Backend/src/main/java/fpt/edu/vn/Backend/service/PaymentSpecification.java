package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.Payment;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PaymentSpecification implements Specification<Payment> {
    private final String keyword;

    public PaymentSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if(keyword.isEmpty() || keyword == null)
            return criteriaBuilder.conjunction();
        Join<Payment, Account> joinAccount = root.join("account",JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(root.get("paymentAmount"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("status"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("method"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("type"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate"),"%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinAccount.get("accountId"),"%" + keyword + "%"));

        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

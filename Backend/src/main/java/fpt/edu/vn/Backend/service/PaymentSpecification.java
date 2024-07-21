package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Payment;
import jakarta.persistence.criteria.*;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PaymentSpecification implements Specification<Payment> {
    private final Payment.Type type;
    private final Payment.Status status;
    private final LocalDateTime fromDate;
    private final LocalDateTime toDate;
    private final Integer accountId;
    private final String keyword;

    public PaymentSpecification(
            @Nullable Payment.Type type, @Nullable Payment.Status status,
            @Nullable LocalDateTime fromDate, @Nullable LocalDateTime toDate,
            @Nullable Integer accountId,
            @Nullable String keyword) {
        this.type = type;
        this.status = status;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.accountId = accountId;
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();
        if (type != null) {
            predicates.add(criteriaBuilder.equal(root.get("type"), type));
        }
        if (status != null) {
            predicates.add(criteriaBuilder.equal(root.get("status"), status));
        }
        if (keyword != null) {
            Join<Payment, Account> joinAccount = root.join("account", JoinType.LEFT);
            Predicate a = criteriaBuilder.like(criteriaBuilder.lower(
                    joinAccount.get("nickname")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate b = criteriaBuilder.like(criteriaBuilder.lower(
                    joinAccount.get("email")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate c = criteriaBuilder.like(criteriaBuilder.lower(
                    joinAccount.get("phone")),
                    "%" + keyword.toLowerCase() + "%");

            predicates.add(criteriaBuilder.or(a, b, c));
        }
        if (fromDate != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createDate"), toDate));
        }
        if (accountId != null) {
            Join<Payment, Account> joinAccount = root.join("account", JoinType.LEFT);
            predicates.add(criteriaBuilder.equal(joinAccount.get("accountId"), accountId));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}

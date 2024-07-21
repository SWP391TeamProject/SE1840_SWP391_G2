package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.Payment;
import jakarta.persistence.criteria.*;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderSpecification implements Specification<Order> {
    private final Payment.Status status;
    private final Order.ShippingStatus shippingStatus;
    private final LocalDateTime fromDate;
    private final LocalDateTime toDate;
    private final Integer accountId;
    private final String keyword;

    public OrderSpecification(
            @Nullable Payment.Status status,
            @Nullable Order.ShippingStatus shippingStatus,
            @Nullable LocalDateTime fromDate, @Nullable LocalDateTime toDate,
            @Nullable Integer accountId,
            @Nullable String keyword) {
        this.status = status;
        this.shippingStatus = shippingStatus;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.accountId = accountId;
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Order> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Join<Order, Payment> joinPayment = root.join("payment", JoinType.LEFT);
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.equal(joinPayment.get("type"), Payment.Type.AUCTION_ORDER));
        if (status != null) {
            predicates.add(criteriaBuilder.equal(joinPayment.get("status"), status));
        }
        if (shippingStatus != null) {
            predicates.add(criteriaBuilder.equal(root.get("shippingStatus"), shippingStatus));
        }
        if (keyword != null) {
            Join<Payment, Account> joinAccount = joinPayment.join("account", JoinType.LEFT);
            Predicate a = criteriaBuilder.like(criteriaBuilder.lower(
                            joinAccount.get("nickname")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate b = criteriaBuilder.like(criteriaBuilder.lower(
                            joinAccount.get("email")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate c = criteriaBuilder.like(criteriaBuilder.lower(
                            joinAccount.get("phone")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate d = criteriaBuilder.like(criteriaBuilder.lower(
                            root.get("shippingAddress")),
                    "%" + keyword.toLowerCase() + "%");
            Predicate e = criteriaBuilder.like(criteriaBuilder.lower(
                            root.get("shippingNote")),
                    "%" + keyword.toLowerCase() + "%");

            predicates.add(criteriaBuilder.or(a, b, c, d, e));
        }
        if (fromDate != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(joinPayment.get("createDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(joinPayment.get("createDate"), toDate));
        }
        if (accountId != null) {
            Join<Payment, Account> joinAccount = joinPayment.join("account", JoinType.LEFT);
            predicates.add(criteriaBuilder.equal(joinAccount.get("accountId"), accountId));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}

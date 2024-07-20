package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ItemSpecification implements Specification<Item> {

    private final String keyword;

    public ItemSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Item> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (keyword == null && keyword.isEmpty()) {
            return criteriaBuilder.conjunction();
        }


        // Add predicates for basic fields
        predicates.add(criteriaBuilder.like(root.get("status").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("buyInPrice").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("reservePrice").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("name").as(String.class), "%" + keyword + "%"));

        predicates.add(criteriaBuilder.like(root.get("description"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("color"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("metal"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("gemstone"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("measurement"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("condition"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("stamped"), "%" + keyword + "%"));

//            // Add predicates for associated entities
//            Join<Item, ItemCategory> itemCategoryJoin = root.join("itemCategory", JoinType.LEFT);
//            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(itemCategoryJoin.get("name")), processedKeyword));
//
        Join<Item, Account> ownerJoin = root.join("owner", JoinType.LEFT);
        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(ownerJoin.get("nickname")), "%" + keyword + "%"));
//
//            Join<Item, Order> orderJoin = root.join("order", JoinType.LEFT);
//            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(orderJoin.get("orderNumber")), processedKeyword));


        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

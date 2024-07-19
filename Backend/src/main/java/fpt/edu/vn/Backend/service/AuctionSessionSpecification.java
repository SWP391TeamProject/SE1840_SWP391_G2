package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.AuctionSession;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AuctionSessionSpecification implements Specification<AuctionSession> {
    private final String keyword;

    public AuctionSessionSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<AuctionSession> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (keyword == null || keyword.isEmpty()) {
            return criteriaBuilder.conjunction();
        }

        List<Predicate> predicates = new ArrayList<>();

        // Add predicates for each field you want to search
        predicates.add(criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("status").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("updateDate").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("startDate").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("endDate").as(String.class), "%" + keyword + "%"));
        // Combine predicates using OR operator
        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ItemSpecification implements Specification<Item> {

    private final Integer minPrice;
    private final Integer maxPrice;
    private final Item.Status status;
    private final Integer categoryId;
    private final String search;

    @Override
    public Predicate toPredicate(Root<Item> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (minPrice != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("reservePrice"), minPrice));
        }

        if (maxPrice != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("reservePrice"), maxPrice));
        }

        if (status != null) {
            predicates.add(criteriaBuilder.equal(root.get("status"), status));
        }

        if (categoryId != null) {
            predicates.add(criteriaBuilder.equal(root.get("itemCategory").get("itemCategoryId"), categoryId));
        }

        if (search != null && !search.isEmpty()) {
            String searchPattern = "%" + search.toLowerCase() + "%";
            Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
            Predicate descriptionPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("description").as(String.class)),
                    searchPattern);
            Predicate colorPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("color")), searchPattern);
            Predicate metalPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("metal")), searchPattern);
            Predicate gemstonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("gemstone")), searchPattern);
            Predicate measurementPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("measurement")), searchPattern);
            Predicate conditionPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("condition")), searchPattern);
            Predicate stampedPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("stamped")), searchPattern);

            predicates.add(criteriaBuilder.or(
                    namePredicate,
                    descriptionPredicate,
                    colorPredicate,
                    metalPredicate,
                    gemstonePredicate,
                    measurementPredicate,
                    conditionPredicate,
                    stampedPredicate
            ));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}

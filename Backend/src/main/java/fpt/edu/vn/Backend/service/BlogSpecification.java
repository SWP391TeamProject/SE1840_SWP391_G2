package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.BlogPost;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class BlogSpecification implements Specification<BlogPost> {
    @Nullable private final String keyword;
    @Nullable private final Integer categoryId;

    @Override
    public Predicate toPredicate(Root<BlogPost> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (keyword != null && !keyword.isEmpty()) {
            String keywordPattern = "%" + keyword.toLowerCase() + "%";
            Predicate titlePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("title").as(String.class)), keywordPattern);
            Predicate contentPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("content").as(String.class)), keywordPattern);
            predicates.add(criteriaBuilder.or(titlePredicate, contentPredicate));
        }

        if (categoryId != null) {
            predicates.add(criteriaBuilder.equal(root.get("category").get("blogCategoryId"), categoryId));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}

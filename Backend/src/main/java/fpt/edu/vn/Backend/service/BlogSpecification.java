package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.pojo.BlogPost;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class BlogSpecification implements Specification<BlogPost> {
    private final String keyword;

    public BlogSpecification(String keyword) {
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<BlogPost> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (keyword == null || keyword.isEmpty()) {
            return criteriaBuilder.conjunction();
        }
        Join<BlogPost, BlogCategory> joinCategory = root.join("category",JoinType.LEFT);
        Join<BlogPost, Account> joinAuthor = root.join("author",JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinAuthor.get("nickname").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(root.get("createDate").as(String.class), "%" + keyword + "%"));
        predicates.add(criteriaBuilder.like(joinCategory.get("name").as(String.class), "%" + keyword + "%"));

        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}

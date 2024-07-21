package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.CitizenCard;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class AccountSpecification implements Specification<Account> {
    @Nullable private final Account.Role role;
    @Nullable private final Account.Status status;
    @Nullable private final String keyword;

    @Override
    public Predicate toPredicate(Root<Account> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (role != null) {
            predicates.add(criteriaBuilder.equal(root.get("role"), role));
        }

        if (status != null) {
            predicates.add(criteriaBuilder.equal(root.get("status"), status));
        }

        if (keyword != null && !keyword.isEmpty()) {
            String keywordPattern = "%" + keyword.toLowerCase() + "%";
            Predicate nicknamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("nickname")), keywordPattern);
            Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), keywordPattern);
            Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), keywordPattern);

            Predicate accountPredicate = criteriaBuilder.or(nicknamePredicate, emailPredicate, phonePredicate);

            Join<Account, CitizenCard> citizenCardJoin = root.join("citizenCard", JoinType.LEFT);
            Predicate cardIdPredicate = criteriaBuilder.like(criteriaBuilder.lower(citizenCardJoin.get("cardId")), keywordPattern);
            Predicate fullNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(citizenCardJoin.get("fullName")), keywordPattern);
            Predicate addressPredicate = criteriaBuilder.like(criteriaBuilder.lower(citizenCardJoin.get("address")), keywordPattern);
            Predicate cityPredicate = criteriaBuilder.like(criteriaBuilder.lower(citizenCardJoin.get("city")), keywordPattern);

            Predicate citizenCardPredicate = criteriaBuilder.or(cardIdPredicate, fullNamePredicate, addressPredicate, cityPredicate);

            predicates.add(criteriaBuilder.or(accountPredicate, citizenCardPredicate));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ConsignmentSpecification implements Specification<Consignment> {
    private final @Nullable Consignment.Status status;
    private final @Nullable LocalDateTime from;
    private final @Nullable LocalDateTime to;
    private final @Nullable Integer customer;
    private final @Nullable Integer staff;
    private final @Nullable String search;

    @Override
    public Predicate toPredicate(Root<Consignment> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();

        if (status != null) {
            predicates.add(builder.equal(root.get("status"), status));
        }

        if (from != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("createDate"), from));
        }

        if (to != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("createDate"), to));
        }

        if (customer != null) {
            predicates.add(builder.equal(root.get("user").get("accountId"), customer));
        }

        if (staff != null) {
            predicates.add(builder.or(
                    builder.equal(root.get("staff").get("accountId"), staff),
                    builder.isNull(root.get("staff"))
            ));
        }

        if (search != null && !search.isEmpty()) {
            String pattern = "%" + search.toLowerCase() + "%";
            Predicate contactEmailPredicate = builder.like(builder.lower(root.get("contactEmail")), pattern);
            Predicate contactNamePredicate = builder.like(builder.lower(root.get("contactName")), pattern);
            Predicate contactPhonePredicate = builder.like(builder.lower(root.get("contactPhone")), pattern);
            Predicate descriptionPredicate = builder.like(builder.lower(root.get("description").as(String.class)), pattern);
            Predicate colorPredicate = builder.like(builder.lower(root.get("color")), pattern);
            Predicate metalPredicate = builder.like(builder.lower(root.get("metal")), pattern);
            Predicate gemstonePredicate = builder.like(builder.lower(root.get("gemstone")), pattern);
            Predicate measurementPredicate = builder.like(builder.lower(root.get("measurement")), pattern);
            Predicate conditionPredicate = builder.like(builder.lower(root.get("condition")), pattern);
            Predicate stampedPredicate = builder.like(builder.lower(root.get("stamped")), pattern);

            Join<Consignment, ConsignmentDetail> cdj = root.join("consignmentDetails", JoinType.LEFT);
            Predicate cdp = builder.like(builder.lower(cdj.get("description").as(String.class)), pattern);

            Predicate searchPredicate = builder.or(contactEmailPredicate, contactNamePredicate, contactPhonePredicate,
                    descriptionPredicate, colorPredicate, metalPredicate, gemstonePredicate, measurementPredicate,
                    conditionPredicate, stampedPredicate, cdp);

            predicates.add(searchPredicate);
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}

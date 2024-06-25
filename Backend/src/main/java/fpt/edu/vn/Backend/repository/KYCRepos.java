package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.CitizenCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KYCRepos extends JpaRepository<CitizenCard, Integer> {

    CitizenCard findByCardId(String cardId);



}

package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.CitizenCard;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface KYCRepos extends JpaRepository<CitizenCard, Integer> {

    CitizenCard findByCardId(String cardId);

    Optional<CitizenCard> findByUserId(int userId);


}

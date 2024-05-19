package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.CitizenCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitizenCardRepos extends JpaRepository<CitizenCard, Integer> {
}

package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.CitizenCard;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CitizenCardDTO implements Serializable {
    private int userId;
    private String cardId;
    private String fullName;
    private LocalDate birthday;
    private boolean gender;
    private String address;
    private String city;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public CitizenCardDTO(CitizenCard citizenCard) {
        this.userId = citizenCard.getUserId();
        this.fullName = citizenCard.getFullName();
        this.birthday = citizenCard.getBirthday();
        this.cardId = citizenCard.getCardId();
        this.gender = citizenCard.isGender();
        this.address = citizenCard.getAddress();
        this.city = citizenCard.getCity();
    }

    // getters and setters
    // ...
}
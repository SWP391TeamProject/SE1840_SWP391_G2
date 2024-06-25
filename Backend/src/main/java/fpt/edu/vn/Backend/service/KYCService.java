package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.CitizenCardDTO;
import fpt.edu.vn.Backend.DTO.request.KycRequestDTO;
import org.springframework.security.core.Authentication;

public interface KYCService {


    CitizenCardDTO verifyKyc(KycRequestDTO kycRequestDTO, Authentication authentication);



}

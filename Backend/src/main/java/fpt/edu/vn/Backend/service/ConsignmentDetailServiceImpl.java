package fpt.edu.vn.Backend.service;


import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentDetailRequestDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import fpt.edu.vn.Backend.repository.ConsignmentDetailRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "consignmentDetail")
public class ConsignmentDetailServiceImpl implements ConsignmentDetailService {
    private ConsignmentDetailRepos consignmentDetailRepos;
    private AttachmentRepos attachmentRepos;
    private AccountRepos accountRepos;
    private ConsignmentRepos consignmentRepos;

    @Autowired
    public ConsignmentDetailServiceImpl(ConsignmentDetailRepos consignmentDetailRepos, AttachmentRepos attachmentRepos, AccountRepos accountRepos, ConsignmentRepos consignmentRepos) {
        this.consignmentDetailRepos = consignmentDetailRepos;
        this.attachmentRepos = attachmentRepos;
        this.accountRepos = accountRepos;
        this.consignmentRepos = consignmentRepos;
    }

    @Override
    @Cacheable(key = "#pageable.pageNumber",value = "consignmentDetail")
    public Page<ConsignmentDetailDTO> getAllConsignmentsDetail(Pageable pageable) {
        return consignmentDetailRepos.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Cacheable(key = "#consignmentId",value = "consignmentDetail")
    public List<ConsignmentDetailDTO> getConsignmentsDetailByConsignmentId(int consignmentId) {
        List<ConsignmentDetail> consignmentDetails = consignmentDetailRepos.findDistinctByConsignment_ConsignmentId(consignmentId);
        return consignmentDetails.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(key = "#consignmentDetailId",value = "consignmentDetail")
    public ConsignmentDetailDTO getConsignmentDetailById(int consignmentDetailId) {
        ConsignmentDetail consignmentDetail = consignmentDetailRepos.findById(consignmentDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Consignment detail not found with id " + consignmentDetailId));
        return new ConsignmentDetailDTO(consignmentDetail);
    }

    @Override
    @CacheEvict(value = "consignmentDetail", allEntries = true)
    public ConsignmentDetailDTO createConsignmentDetail(ConsignmentDetailRequestDTO consignmentRequestDetailDTO) {
        try {
            ConsignmentDetail consignmentDetail = new ConsignmentDetail();

            // Fetch Consignment by ID
            Consignment consignment = consignmentRepos.findByConsignmentId(consignmentRequestDetailDTO.getConsignmentId());
            if (consignment == null) {
                throw new ResourceNotFoundException("Consignment not found");
            }
            consignmentDetail.setConsignment(consignment);

            consignmentDetail.setDescription(consignmentRequestDetailDTO.getDescription());
            consignmentDetail.setPrice(consignmentRequestDetailDTO.getPrice());
            consignmentDetail.setCreateDate(LocalDateTime.now());
            consignmentDetail.setUpdateDate(LocalDateTime.now());
            // Fetch Account by ID
            Account account = accountRepos.findById(consignmentRequestDetailDTO.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
            consignmentDetail.setAccount(account);

            // Set ConsignmentStatus enum
            consignmentDetail.setStatus(ConsignmentDetail.ConsignmentStatus.valueOf(consignmentRequestDetailDTO.getStatus()));

            // Fetch Attachments by IDs

            ConsignmentDetail savedConsignmentDetail = consignmentDetailRepos.save(consignmentDetail);
            return new ConsignmentDetailDTO(savedConsignmentDetail);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error creating consignment detail", e);
        }
    }


    @Override
    @CacheEvict(value = "consignmentDetail", allEntries = true)
    public ConsignmentDetailDTO updateConsignmentDetail(int consignmentDetailId, ConsignmentDetailRequestDTO consignmentRequestDetailDTO) {
            // Find the existing ConsignmentDetail object by ID
            ConsignmentDetail consignmentDetail = consignmentDetailRepos.findById(consignmentDetailId)
                    .orElseThrow(() -> new ResourceNotFoundException("ConsignmentDetail not found with id: " + consignmentDetailId));


            // Update the fields with the provided data from updatedConsignmentDetail
            consignmentDetail.setDescription(consignmentRequestDetailDTO.getDescription());
            consignmentDetail.setPrice(consignmentRequestDetailDTO.getPrice());
            consignmentDetail.setStatus(ConsignmentDetail.ConsignmentStatus.valueOf(consignmentRequestDetailDTO.getStatus()));
            consignmentDetail.setUpdateDate(LocalDateTime.now());
            // Fetch Consignment by ID from DTO and set it in the ConsignmentDetail
            Consignment consignment = consignmentRepos.findByConsignmentId(consignmentRequestDetailDTO.getConsignmentId());
            if (consignment == null) {
                throw new ResourceNotFoundException("Consignment not found");
            }
            consignmentDetail.setConsignment(consignment);

            // Fetch Account by ID from DTO and set it in the ConsignmentDetail
            Account account = accountRepos.findById(consignmentRequestDetailDTO.getAccountId()).orElse(null);
            if (account == null) {
                throw new ResourceNotFoundException("Account not found");
            }
            consignmentDetail.setAccount(account);

            // Save the updated ConsignmentDetail
            ConsignmentDetail savedConsignmentDetail = consignmentDetailRepos.save(consignmentDetail);
            return new ConsignmentDetailDTO(savedConsignmentDetail);

    }

    private ConsignmentDetailDTO mapToDTO(ConsignmentDetail consignmentDetail) {
        List<AttachmentDTO> attachmentIds = consignmentDetail.getAttachments().stream()
                .map(AttachmentDTO::new)
                .collect(Collectors.toList());

        return new ConsignmentDetailDTO(
                consignmentDetail.getConsignmentDetailId(),
                consignmentDetail.getDescription(),
                consignmentDetail.getStatus().toString(), // Convert enum to string
                consignmentDetail.getPrice(),
                consignmentDetail.getConsignment().getConsignmentId(),
                new AccountDTO(consignmentDetail.getAccount()),
                attachmentIds
        );
    }
}

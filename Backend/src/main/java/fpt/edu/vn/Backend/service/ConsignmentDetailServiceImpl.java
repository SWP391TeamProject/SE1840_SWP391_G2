package fpt.edu.vn.Backend.service;


import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
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
    public List<ConsignmentDetailDTO> getConsignmentsDetailByConsignmentId(int consignmentId) {
        List<ConsignmentDetail> consignmentDetails = consignmentDetailRepos.findByConsignmentId(consignmentId);
        return consignmentDetails.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConsignmentDetailDTO getConsignmentDetailById(int consignmentDetailId) {
        ConsignmentDetail consignmentDetail = consignmentDetailRepos.findById(consignmentDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Consignment detail not found with id " + consignmentDetailId));
        return new ConsignmentDetailDTO(consignmentDetail);
    }

    @Override
    public ConsignmentDetailDTO createConsignmentDetail(ConsignmentDetailDTO consignmentDetailDTO) {
        try {
            ConsignmentDetail consignmentDetail = new ConsignmentDetail();
            consignmentDetail.setConsignmentDetailId(consignmentDetailDTO.getConsignmentDetailId());

            // Fetch Consignment by ID
            Consignment consignment = consignmentRepos.findByConsignmentId(consignmentDetailDTO.getConsignmentId());
            if (consignment == null) {
                throw new ResourceNotFoundException("Consignment not found");
            }
            consignmentDetail.setConsignment(consignment);

            consignmentDetail.setDescription(consignmentDetailDTO.getDescription());
            consignmentDetail.setPrice(consignmentDetailDTO.getPrice());

            // Fetch Account by ID
            Account account = accountRepos.findById(consignmentDetailDTO.getAccountId()).orElse(null);
            if (account == null) {
                throw new ResourceNotFoundException("Account not found");
            }
            consignmentDetail.setAccount(account);

            // Set ConsignmentStatus enum
            consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.valueOf(consignmentDetailDTO.getType()));

            // Fetch Attachments by IDs
            List<Integer> attachmentIds = consignmentDetailDTO.getAttachmentIds();
            List<Attachment> attachments = attachmentIds.stream()
                    .map(attachmentId -> attachmentRepos.findById(attachmentId).orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            consignmentDetail.setAttachments(attachments);

            // Set other fields as needed

            ConsignmentDetail savedConsignmentDetail = consignmentDetailRepos.save(consignmentDetail);
            return new ConsignmentDetailDTO(savedConsignmentDetail);
        } catch (Exception e) {
            // Handle exceptions
            throw new RuntimeException("Error creating consignment detail", e);
        }

    }

    @Override
    public ConsignmentDetailDTO updateConsignmentDetail(int consignmentDetailId, ConsignmentDetailDTO updatedConsignmentDetail) {
        try {
            // Find the existing ConsignmentDetail object by ID
            Optional<ConsignmentDetail> optionalConsignmentDetail = consignmentDetailRepos.findById(consignmentDetailId);
            if (!optionalConsignmentDetail.isPresent()) {
                throw new ResourceNotFoundException("ConsignmentDetail not found with id: " + consignmentDetailId);
            }
            ConsignmentDetail consignmentDetail = optionalConsignmentDetail.get();

            // Update the fields with the provided data from updatedConsignmentDetail
            consignmentDetail.setDescription(updatedConsignmentDetail.getDescription());
            consignmentDetail.setPrice(updatedConsignmentDetail.getPrice());
            consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.valueOf(updatedConsignmentDetail.getType()));

            // Fetch Consignment by ID from DTO and set it in the ConsignmentDetail
            Consignment consignment = consignmentRepos.findByConsignmentId(updatedConsignmentDetail.getConsignmentId());
            if (consignment == null) {
                throw new ResourceNotFoundException("Consignment not found");
            }
            consignmentDetail.setConsignment(consignment);

            // Fetch Account by ID from DTO and set it in the ConsignmentDetail
            Account account = accountRepos.findById(updatedConsignmentDetail.getAccountId()).orElse(null);
            if (account == null) {
                throw new ResourceNotFoundException("Account not found");
            }
            consignmentDetail.setAccount(account);

            // Fetch Attachments by IDs from DTO
            List<Integer> attachmentIds = updatedConsignmentDetail.getAttachmentIds();
            List<Attachment> attachments = attachmentIds.stream()
                    .map(attachmentId -> attachmentRepos.findById(attachmentId).orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            consignmentDetail.setAttachments(attachments);

            // Set other fields as needed

            // Save the updated ConsignmentDetail
            ConsignmentDetail savedConsignmentDetail = consignmentDetailRepos.save(consignmentDetail);
            return new ConsignmentDetailDTO(savedConsignmentDetail);
        } catch (Exception e) {
            // Handle exceptions
            throw new RuntimeException("Error updating consignment detail", e);
        }
    }

    private ConsignmentDetailDTO mapToDTO(ConsignmentDetail consignmentDetail) {
        List<Integer> attachmentIds = consignmentDetail.getAttachments().stream()
                .map(Attachment::getAttachmentId)
                .collect(Collectors.toList());

        return new ConsignmentDetailDTO(
                consignmentDetail.getConsignmentDetailId(),
                consignmentDetail.getDescription(),
                consignmentDetail.getType().toString(), // Convert enum to string
                consignmentDetail.getPrice(),
                consignmentDetail.getConsignment().getConsignmentId(),
                consignmentDetail.getAccount().getAccountId(),
                attachmentIds
        );
    }
}

package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ConsignmentDetailRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsignmentServiceImpl implements ConsignmentService {

    AccountService accountService;
    ConsignmentRepos consignmentRepos;
    AccountRepos accountRepos;
    ConsignmentDetailRepos consignmentDetailRepos;
    private static final Logger logger = LoggerFactory.getLogger(ConsignmentServiceImpl.class);

    @Autowired
    public ConsignmentServiceImpl(ConsignmentRepos consignmentRepos, AccountRepos accountRepos, AccountService accountService, ConsignmentDetailRepos consignmentDetailRepos) {
        this.consignmentRepos = consignmentRepos;
        this.accountRepos = accountRepos;
        this.accountService = accountService;
        this.consignmentDetailRepos = consignmentDetailRepos;
    }


    @Override
    public ConsignmentDTO requestConsignmentCreate(int userId, String preferContact, ConsignmentDetailDTO consignmentDetails) {
        try {
            Consignment consignment = new Consignment();
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setDescription(consignmentDetails.getDescription());
            detail.setPrice(consignmentDetails.getPrice());
            detail.setType(ConsignmentDetail.ConsignmentStatus.REQUEST);
            detail.setAccount(accountRepos.findById(userId).orElseThrow(() -> new ConsignmentServiceException("User not found")));
            consignment.setPreferContact(Consignment.preferContact.valueOf(preferContact.toUpperCase()));
            consignment.setStatus(Consignment.Status.WAITING_STAFF);
            consignment.setConsignmentDetails(List.of(detail));
            consignment = consignmentRepos.save(consignment);
            detail.setConsignment(consignment);
            consignmentDetailRepos.save(detail);
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error creating consignment", e);
            throw new ConsignmentServiceException("Error creating consignment", e);
        }
    }

    @Override
    public void submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments) {
        try {
            consignmentRepos.findById(consignmentId).ifPresent(consignment -> {
                if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                        detail.getType().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                    throw new ConsignmentServiceException("Initial Evaluation already submitted");
                }
                ConsignmentDetail detail = new ConsignmentDetail();
                detail.setType(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION);
                detail.setAccount(accountRepos.findById(accountId).orElseThrow());
                detail.setPrice(price);
                detail.setDescription(evaluation);
                detail.setAttachments(attachments);
                consignment.getConsignmentDetails().add(detail);
                consignmentRepos.save(consignment);
            });
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error submitting initial evaluation");
        }
    }

    @Override
    public void submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments) {

        try {
            consignmentRepos.findById(consignmentId).ifPresent(consignment -> {
                if (consignment.getConsignmentDetails().stream().noneMatch(detail ->
                        detail.getType().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                    throw new ConsignmentServiceException("Initial Evaluation not submitted");
                }
                if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                        detail.getType().equals(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION))) {
                    throw new ConsignmentServiceException("Final Evaluation already submitted");
                }
                ConsignmentDetail detail = new ConsignmentDetail();
                detail.setType(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION);
                detail.setAccount(accountRepos.findById(accountId).orElseThrow());
                detail.setPrice(price);
                detail.setDescription(evaluation);
                detail.setAttachments(attachments);
                consignment.getConsignmentDetails().add(detail);
                consignmentRepos.save(consignment);
            });
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error submitting final evaluation");
        }


    }

    @Override
    public void confirmJewelryReceived(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId)
                    .orElse(null);
            if (consignment.getStatus() == Consignment.Status.SENDING) {
                consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not SENDING");
            }
        } catch (Exception e) {
            logger.error("Error confirming jewelry received", e);
            throw new ConsignmentServiceException("Consignment NOT FOUND");
        }
    }

    @Override
    public void approveFinalEvaluation(int consignmentId, int accountId, String description) {
        try {
            // Retrieve consignment by ID
            Consignment consignment = consignmentRepos.findById(consignmentId).orElse(null);
            if (consignment == null) {
                throw new ConsignmentServiceException("Consignment not found");
            }

            // Check if the consignment is in final evaluation status
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION) && consignment.getConsignmentId() == consignmentId && consignment.getConsignmentDetails().stream().anyMatch(detail -> detail.getType().equals(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION))) {
                // Retrieve account by ID
                AccountDTO dto = accountService.getAccountById(accountId);
                if (dto == null) {
                    throw new ConsignmentServiceException("Account not found");
                }

                // Create and set consignment detail
                ConsignmentDetail consignmentDetail = new ConsignmentDetail();
                consignment.setStatus(Consignment.Status.FINISHED); // Set status consignment when completed
                consignmentDetail.setAccount(accountRepos.findById(accountId).orElse(null));
                consignmentDetail.setConsignmentDetailId(consignmentId);
                consignmentDetail.setConsignment(consignment);
                consignmentDetail.setPrice(dto.getBalance());
                consignmentDetail.setDescription(description);
                consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.MANAGER_ACCEPTED);
//            consignment.getConsignmentDetails().add(consignmentDetail);

                // Save the consignment
                consignmentDetailRepos.save(consignmentDetail);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in final evaluation status");
            }
        } catch (Exception e) {
            logger.error("Error processing consignment", e);
            throw new ConsignmentServiceException("Error processing consignment", e);
        }

    }


    @Override
    public void rejectFinalEvaluation(int consignmentId, int accountId, String rejectionReason) {
        try {
            // Retrieve consignment by ID
            Consignment consignment = consignmentRepos.findById(consignmentId).orElse(null);
            if (consignment == null) {
                throw new ConsignmentServiceException("Consignment not found");
            }

            // Check if the consignment is in final evaluation status
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION) && consignment.getConsignmentId() == consignmentId) {
                // Retrieve account by ID
                AccountDTO dto = accountService.getAccountById(accountId);
                if (dto == null) {
                    throw new ConsignmentServiceException("Account not found");
                }

                // Create and set consignment detail
                ConsignmentDetail consignmentDetail = new ConsignmentDetail();
                consignment.setStatus(Consignment.Status.TERMINATED); // Set status consignment when completed
                consignmentDetail.setAccount(accountRepos.findById(accountId).orElse(null));
                consignmentDetail.setConsignmentDetailId(consignmentId);
                consignmentDetail.setConsignment(consignment);
                consignmentDetail.setPrice(dto.getBalance());
                consignmentDetail.setDescription(rejectionReason);
                consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.MANAGER_REJECTED);
//            consignment.getConsignmentDetails().add(consignmentDetail);

                // Save the consignment
                consignmentDetailRepos.save(consignmentDetail);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in final evaluation status");
            }
        } catch (Exception e) {
            logger.error("Error processing consignment", e);
            throw new ConsignmentServiceException("Error processing consignment", e);
        }
    }

    @Override
    public void confirmAuctionParticipation(int consignmentId) {

    }

    @Override
    public void assignAuctionSession(int consignmentId, int auctionSessionId) {

    }

    @Override
    public void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            consignment.setPreferContact(Consignment.preferContact.valueOf(updatedConsignment.getPreferContact().toUpperCase()));
            consignment.setCreateDate(updatedConsignment.getCreateDate());
            consignment.setUpdateDate(updatedConsignment.getUpdateDate());
            consignment.setStatus(Consignment.Status.valueOf(updatedConsignment.getStatus().toUpperCase()));
            consignmentRepos.save(consignment);
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error updating consignment", e);
        }
    }

    @Override
    public ConsignmentDTO getConsignmentById(int id) {
        return null;
    }

    @Override
    public Page<ConsignmentDTO> getAllConsignments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Consignment> consignmentPage = consignmentRepos.findAll(pageable);

        return getConsignmentDTOS(pageable, consignmentPage);
    }


    @Override
    public Page<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        try {
            Consignment.Status enumStatus = Consignment.Status.valueOf(status.toUpperCase());
            Page<Consignment> consignmentPage = consignmentRepos.findByStatus(enumStatus, pageable);

            return getConsignmentDTOS(pageable, consignmentPage);
        } catch (IllegalArgumentException e) {
            throw new ConsignmentServiceException("Invalid status value: " + status, e);
        }
    }

    @Override
    public Page<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Consignment> consignmentPage = consignmentRepos.findByConsignmentId(userId, pageable);

        return getConsignmentDTOS(pageable, consignmentPage);
    }

    @NotNull
    private Page<ConsignmentDTO> getConsignmentDTOS(Pageable pageable, Page<Consignment> consignmentPage) {
        List<ConsignmentDTO> consignmentDTOs = consignmentPage.getContent().stream()
                .map(this::getConsignmentDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(consignmentDTOs, pageable, consignmentPage.getTotalElements());
    }

    @NotNull
    private ConsignmentDTO getConsignmentDTO(Consignment consignment) {
        List<ConsignmentDetailDTO> consignmentDetailDTOs = consignment.getConsignmentDetails().stream()
                .map(detail -> new ConsignmentDetailDTO(
                        detail.getConsignmentDetailId(),
                        detail.getDescription(),
                        detail.getType().toString(),
                        detail.getPrice(),
                        detail.getConsignment().getConsignmentId(),
                        detail.getAccount().getAccountId(),
                        detail.getAttachments() == null ? null : detail.getAttachments().stream().map(Attachment::getAttachmentId).collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        return new ConsignmentDTO(
                consignment.getConsignmentId(),
                String.valueOf(consignment.getStatus()),
                String.valueOf(consignment.getPreferContact()),
                consignment.getCreateDate(),
                consignment.getUpdateDate(),
                consignmentDetailDTOs
        );
    }

    @Override
    public Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId) {
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow();
        List<ConsignmentDetailDTO> consignmentDetailDTOs = new ArrayList<>();
        for (ConsignmentDetail detail : consignment.getConsignmentDetails()) {
            consignmentDetailDTOs.add(ConsignmentDetailDTO.builder()
                    .consignmentDetailId(detail.getConsignmentDetailId())
                    .description(detail.getDescription())
                    .type(detail.getType().toString())
                    .price(detail.getPrice())
                    .consignmentId(detail.getConsignment().getConsignmentId())
                    .accountId(detail.getAccount().getAccountId())
                    .attachmentIds(List.of(detail.getAttachments().stream().map(Attachment::getAttachmentId).toArray(Integer[]::new)))
                    .build());
        }
        return new PageImpl<>(consignmentDetailDTOs);
    }

    @Override
    public void deleteConsignment(int id) {
        try {
            consignmentRepos.deleteById(id);
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error deleting consignment", e);
        }
    }
}

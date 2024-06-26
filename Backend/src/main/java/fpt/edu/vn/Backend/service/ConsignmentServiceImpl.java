package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ConsignmentDetailRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import fpt.edu.vn.Backend.repository.NotificationRepos;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@CacheConfig(cacheNames = "consignments")
public class ConsignmentServiceImpl implements ConsignmentService {

    private final RedisCacheManager cacheManager;
    AccountService accountService;
    ConsignmentRepos consignmentRepos;
    AccountRepos accountRepos;
    ConsignmentDetailRepos consignmentDetailRepos;
    NotificationRepos notificationRepos;
    private static final Logger logger = LoggerFactory.getLogger(ConsignmentServiceImpl.class);

    @Autowired
    public ConsignmentServiceImpl(ConsignmentRepos consignmentRepos, AccountRepos accountRepos, AccountService accountService, ConsignmentDetailRepos consignmentDetailRepos, NotificationRepos notificationRepos, RedisCacheManager cacheManager) {
        this.consignmentRepos = consignmentRepos;
        this.accountRepos = accountRepos;
        this.accountService = accountService;
        this.consignmentDetailRepos = consignmentDetailRepos;
        this.notificationRepos = notificationRepos;
        this.cacheManager = cacheManager;
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
        List<ConsignmentDetailDTO> consignmentDetailDTOs = Collections.emptyList();
        if (consignment.getConsignmentDetails() == null) {
            consignment.setConsignmentDetails(new ArrayList<>());
        } else {
            consignmentDetailDTOs = consignment.getConsignmentDetails().stream()
                    .map(detail -> new ConsignmentDetailDTO(
                            detail.getConsignmentDetailId(),
                            detail.getDescription(),
                            detail.getStatus().toString(),
                            detail.getPrice(),
                            detail.getConsignment().getConsignmentId(),
                            new AccountDTO(detail.getAccount()),
                            detail.getAttachments() == null ? null : detail.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList());
        }
        return new ConsignmentDTO(
                consignment.getConsignmentId(),
                String.valueOf(consignment.getStatus()),
                String.valueOf(consignment.getPreferContact()),
                consignment.getStaff() != null ? new AccountDTO(consignment.getStaff()) : null,
                consignment.getCreateDate(),
                consignment.getUpdateDate(),
                consignmentDetailDTOs
        );
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDTO requestConsignmentCreate(int userId, String preferContact, ConsignmentDetailDTO consignmentDetails) {
        try {
            Consignment consignment = new Consignment();
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setDescription(consignmentDetails.getDescription());
            detail.setPrice(consignmentDetails.getPrice());
            detail.setStatus(ConsignmentDetail.ConsignmentStatus.REQUEST);
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
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDetailDTO submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                    detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation already submitted");
            }
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setStatus(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION);
            detail.setAccount(accountRepos.findById(accountId).orElseThrow(
                    () -> new ConsignmentServiceException("Account not found")
            ));
            detail.setPrice(price);
            detail.setDescription(evaluation);
            detail.setConsignment(consignment);
            detail = consignmentDetailRepos.save(detail);
            logger.info("Initial Evaluation submitted :" + detail.getConsignmentDetailId());
            if (consignment.getConsignmentDetails() == null || consignment.getConsignmentDetails().isEmpty()) {
                consignment.setConsignmentDetails(new ArrayList<>());
            }
            consignment.getConsignmentDetails().add(detail);
            consignment.setStatus(Consignment.Status.IN_INITIAL_EVALUATION);
            consignmentRepos.save(consignment);

            Notification notification = new Notification();
            notification.setAccount(consignment.getStaff());
            if (consignment.getStaff() != null) {
                notification.setMessage("Update Status To IN_INITIAL_EVALUATION By" + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
            } else {
                notification.setMessage("Update Status To IN_INITIAL_EVALUATION By unknown staff");
            }
            notification.setType("Update Info");
            notification.setRead(false);
            notification.setCreateDate(LocalDateTime.now());
            notification.setUpdateDate(LocalDateTime.now());
            notificationRepos.save(notification);

            return new ConsignmentDetailDTO(detail);
        } catch (Exception e) {
            logger.error("Error submitting initial evaluation", e);
            throw new ConsignmentServiceException("Error submitting initial evaluation");
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDetailDTO submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId) {

        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getConsignmentDetails().stream().noneMatch(detail ->
                    detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation not submitted");
            }
            int countFin = 0;
            int countRej = 0;
            for (ConsignmentDetail detail : consignment.getConsignmentDetails()) {
                if (detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION)) {
                    countFin++;
                }
                if (detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.MANAGER_REJECTED)) {
                    countRej++;
                }
            }
            if (countFin > countRej) {
                throw new ConsignmentServiceException("Final Evaluation already submitted");
            }

            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setStatus(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION);
            detail.setAccount(accountRepos.findById(accountId).orElseThrow());
            detail.setPrice(price);
            detail.setDescription(evaluation);
            detail.setConsignment(consignment);
            detail = consignmentDetailRepos.save(detail);
            if (consignment.getConsignmentDetails() == null || consignment.getConsignmentDetails().isEmpty()) {
                consignment.setConsignmentDetails(new ArrayList<>());
            }
            consignment.getConsignmentDetails().add(detail);
            consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);
            consignmentRepos.save(consignment);

            Notification notification = new Notification();
            notification.setAccount(consignment.getStaff());
            if (consignment.getStaff() != null) {
                notification.setMessage("Update Status To FINAL_EVALUATION By" + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
            } else {
                notification.setMessage("Update Status To FINAL_EVALUATION By unknown staff");
            }
            notification.setType("Update Info");
            notification.setRead(false);
            notification.setCreateDate(LocalDateTime.now());
            notification.setUpdateDate(LocalDateTime.now());
            notificationRepos.save(notification);

            return new ConsignmentDetailDTO(detail);
        } catch (Exception e) {
            logger.error("Error submitting final evaluation", e);
            throw new ConsignmentServiceException("Error submitting final evaluation");
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public void confirmJewelryReceived(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId)
                    .orElse(null);
            if (consignment.getStatus() == Consignment.Status.SENDING) {
                consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);

                Notification notification = new Notification();
                notification.setAccount(consignment.getStaff());
                if (consignment.getStaff() != null) {
                    notification.setMessage("Confirm Jewelry Received By" + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
                } else {
                    notification.setMessage("Confirm Jewelry Received By unknown staff");
                }
                notification.setType("Confirm");
                notification.setRead(false);
                notification.setCreateDate(LocalDateTime.now());
                notification.setUpdateDate(LocalDateTime.now());
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
    @CacheEvict(value = "consignments", allEntries = true)

    public void approveFinalEvaluation(int consignmentId, int accountId, String description) {
        try {
            // Retrieve consignment by ID
            Consignment consignment = consignmentRepos.findById(consignmentId).orElse(null);
            if (consignment == null) {
                throw new ConsignmentServiceException("Consignment not found");
            }
            Account account = accountRepos.findById(accountId).orElseThrow(() -> new ConsignmentServiceException("Account not found"));
            if (!account.getRole().equals(Account.Role.MANAGER)) {
                throw new ConsignmentServiceException("Account is not manager");
            }
            // Check if the consignment is in final evaluation status
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION) && consignment.getConsignmentId() == consignmentId && consignment.getConsignmentDetails().stream().anyMatch(detail -> detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION))) {

                // Create and set consignment detail
                ConsignmentDetail consignmentDetail = consignmentDetailRepos.findDistinctByConsignment_ConsignmentId(consignmentId).get(
                        consignmentDetailRepos.findDistinctByConsignment_ConsignmentId(consignmentId).toArray().length - 1
                );
                consignment.setStatus(Consignment.Status.WAITING_SELLER); // Set status consignment when completed
                consignmentDetail.setStatus(ConsignmentDetail.ConsignmentStatus.MANAGER_ACCEPTED);
                consignmentDetail = consignmentDetailRepos.save(consignmentDetail);
                consignment.getConsignmentDetails().add(consignmentDetail);
                // Save the consignment
                Notification notification = new Notification();
                notification.setAccount(consignment.getStaff());
                if (consignment.getStaff() != null) {
                    notification.setMessage("Accepted By " + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
                } else {
                    notification.setMessage("Accepted By unknown staff");
                }
                notification.setType("Accepted");
                notification.setRead(false);
                notification.setCreateDate(LocalDateTime.now());
                notification.setUpdateDate(LocalDateTime.now());
                notificationRepos.save(notification);

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
    @CacheEvict(value = "consignments", allEntries = true)

    public void rejectFinalEvaluation(int consignmentId, int accountId, String rejectionReason) {
        try {
            // Retrieve consignment by ID
            Consignment consignment = consignmentRepos.findById(consignmentId).orElse(null);
            if (consignment == null) {
                throw new ConsignmentServiceException("Consignment not found");
            }
            Account account = accountRepos.findById(accountId).orElseThrow(() -> new ConsignmentServiceException("Account not found"));
            if (!account.getRole().equals(Account.Role.MANAGER)) {
                throw new ConsignmentServiceException("Account is not manager");
            }
            // Check if the consignment is in final evaluation status
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION) && consignment.getConsignmentId() == consignmentId) {
                // Create and set consignment detail
                ConsignmentDetail consignmentDetail = new ConsignmentDetail();
                consignmentDetail.setAccount(account);
                consignmentDetail.setConsignment(consignment);
                consignmentDetail.setPrice(null);
                consignmentDetail.setDescription(rejectionReason);
                consignmentDetail.setStatus(ConsignmentDetail.ConsignmentStatus.MANAGER_REJECTED);
                consignmentDetail = consignmentDetailRepos.save(consignmentDetail);
                consignment.getConsignmentDetails().add(consignmentDetail);
                // Save the consignment
                Notification notification = new Notification();
                notification.setAccount(consignment.getStaff());
                if (consignment.getStaff() != null) {
                    notification.setMessage("Rejected By " + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
                } else {
                    notification.setMessage("Rejected By unknown staff");
                }
                notification.setType("Rejected");
                notification.setRead(false);
                notification.setCreateDate(LocalDateTime.now());
                notification.setUpdateDate(LocalDateTime.now());
                notificationRepos.save(notification);

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
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDTO custAcceptInitialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.IN_INITIAL_EVALUATION)) {
                consignment.setStatus(Consignment.Status.SENDING);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in IN_INITIAL_EVALUATION status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error accepting initial evaluation", e);
            throw new ConsignmentServiceException("Error accepting initial evaluation", e);
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDTO custRejectInitialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.IN_INITIAL_EVALUATION)) {
                consignment.setStatus(Consignment.Status.TERMINATED);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in IN_INITIAL_EVALUATION status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error rejecting initial evaluation", e);
            throw new ConsignmentServiceException("Error rejecting initial evaluation", e);
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDTO custAcceptFinaltialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.WAITING_SELLER)) {
                consignment.setStatus(Consignment.Status.FINISHED);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in IN_FinalTIAL_EVALUATION status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error accepting Final evaluation", e);
            throw new ConsignmentServiceException("Error accepting final evaluation", e);
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDTO custRejectFinaltialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.WAITING_SELLER)) {
                consignment.setStatus(Consignment.Status.TERMINATED);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in IN_FINAL_EVALUATION status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error rejecting final evaluation", e);
            throw new ConsignmentServiceException("Error rejecting Final evaluation", e);
        }
    }


    @Override
    @CacheEvict(value = "consignments", allEntries = true)

    public void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            consignment.setPreferContact(Consignment.preferContact.valueOf(updatedConsignment.getPreferContact().toUpperCase()));
            consignment.setCreateDate(updatedConsignment.getCreateDate());
            consignment.setUpdateDate(updatedConsignment.getUpdateDate());
            consignment.setStatus(Consignment.Status.valueOf(updatedConsignment.getStatus().toUpperCase()));

            consignment.setStaff(updatedConsignment.getStaff() == null ? null : accountRepos.findById(updatedConsignment.getStaff().getAccountId()).orElseThrow(() -> new ConsignmentServiceException("Account not found")));

            Notification notification = new Notification();
            notification.setAccount(consignment.getStaff());
            if (consignment.getStaff() != null) {
                notification.setMessage("Update Consignment By " + consignment.getStaff().getNickname() + " " + consignment.getStaff().getRole());
            } else {
                notification.setMessage("Update Info By unknown staff");
            }
            notification.setRead(false);
            notification.setCreateDate(LocalDateTime.now());
            notification.setUpdateDate(LocalDateTime.now());
            notificationRepos.save(notification);

            consignmentRepos.save(consignment);
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error updating consignment", e);
        }
    }

    @Override
    public ConsignmentDTO getConsignmentById(int id) {


        return consignmentRepos.findById(id).map(this::getConsignmentDTO).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
    }

    @Override
    @Cacheable(key = "#pageable.pageNumber", value = "consignments")
    public Page<ConsignmentDTO> getAllConsignments(Pageable pageable) {
        Page<Consignment> consignmentPage = consignmentRepos.findAll(pageable);
        return getConsignmentDTOS(pageable, consignmentPage);
    }


    @Override
    @Cacheable(key = "#status + #page + #size + #accID", value = "consignments")
    public Page<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size, int accID) {
        Consignment.Status enumStatus = Consignment.Status.valueOf(status.toUpperCase());
        Pageable pageable = PageRequest.of(page, size);
        if(Consignment.Status.WAITING_STAFF.equals(enumStatus)){
            return getConsignmentDTOS(pageable,  consignmentRepos.findByStatus(enumStatus, pageable));
        }
        Account.Role role = accountRepos.findById(accID).orElseThrow(
                ()-> new ResourceNotFoundException("Account not found")).getRole();
        try {
            Page<Consignment> consignmentPage;
            if (role.equals(Account.Role.valueOf("MANAGER")) ||
                    role.equals(Account.Role.valueOf("ADMIN"))) {
                consignmentPage = consignmentRepos.findByStatus(enumStatus, pageable);
            }else if(role.equals(Account.Role.valueOf("STAFF"))){
                consignmentPage = consignmentRepos.findByStatusAndStaff_AccountId(enumStatus,accID, pageable);
            }else{
                return null;
            }
            return getConsignmentDTOS(pageable, consignmentPage);
        } catch (IllegalArgumentException e) {
            throw new ConsignmentServiceException("Invalid status value: " + status, e);
        }
    }

    @Override
    @Cacheable(key = "#userId + #page + #size", value = "consignments")
    public Page<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Consignment> consignmentPage = consignmentRepos.findByUserID(userId, pageable);

        consignmentPage.stream().filter(consignment -> consignment.getStatus().equals(Consignment.Status.FINISHED)).forEach(consignment -> {
            consignment.setConsignmentDetails(consignment.getConsignmentDetails().stream().filter(detail -> detail.getStatus().equals(ConsignmentDetail.ConsignmentStatus.MANAGER_ACCEPTED)).toList());
        });
//        logger.info("Retrieved consignments by user ID: " + consignmentPage.size()  );

        return getConsignmentDTOS(pageable, consignmentPage);

//        return PageImpl(consignmentPage.stream().map(this::getConsignmentDTO).collect(Collectors.toList()));
    }


    @Override
    @Cacheable(key = "#consignmentId", value = "consignments")
    public Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId) {
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow();
        List<ConsignmentDetailDTO> consignmentDetailDTOs = new ArrayList<>();
        for (ConsignmentDetail detail : consignment.getConsignmentDetails()) {
            consignmentDetailDTOs.add(ConsignmentDetailDTO.builder()
                    .consignmentDetailId(detail.getConsignmentDetailId())
                    .description(detail.getDescription())
                    .status(detail.getStatus().toString())
                    .price(detail.getPrice())
                    .consignmentId(detail.getConsignment().getConsignmentId())
                    .account(new AccountDTO(detail.getAccount()))
                    .attachments(detail.getAttachments().stream().map(AttachmentDTO::new).toList())
                    .build());
        }
        return new PageImpl<>(consignmentDetailDTOs);
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)
    public ResponseEntity<ConsignmentDTO> deleteConsignment(int id) {
        if (consignmentRepos.findByConsignmentId(id) == null) {
            throw new ConsignmentServiceException("Consignment not found");
        }
        consignmentRepos.deleteById(id);

        return null;
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDTO takeConsignment(int consignmentId, int accountId) {
        Account account = accountRepos.findById(accountId).orElseThrow(
                () -> new ConsignmentServiceException("Account not found : " + accountId));
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(
                () -> new ConsignmentServiceException("Consignment not found : " + consignmentId));
        if (account.getRole().equals(Account.Role.STAFF) && consignment.getStatus().equals(Consignment.Status.WAITING_STAFF) && consignment.getStaff() == null) {
            consignment.setStatus(Consignment.Status.IN_INITIAL_EVALUATION);
            consignment.setStaff(account);
            consignment = consignmentRepos.save(consignment);
            return getConsignmentDTO(consignment);
        } else {
            throw new ConsignmentServiceException("Consignment just available for staff");
        }
    }

    @Override
    @CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDTO receivedConsignment(int consignmentId) {
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(
                () -> new ConsignmentServiceException("Consignment not found : " + consignmentId));
        if (consignment.getStatus().equals(Consignment.Status.SENDING)) {
            consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);
            consignmentRepos.save(consignment);
            return getConsignmentDTO(consignment);
        } else {
            throw new ConsignmentServiceException("Consignment is not in SENDING status");
        }
    }
}

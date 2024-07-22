package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentRequestDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateConsignmentStatusRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
//@CacheConfig(cacheNames = "consignments")
public class ConsignmentServiceImpl implements ConsignmentService {

    private static final Logger logger = LoggerFactory.getLogger(ConsignmentServiceImpl.class);
    private final ConsignmentRepos consignmentRepos;
    private final AccountRepos accountRepos;
    private final ItemRepos itemRepos;
    private final ConsignmentDetailRepos consignmentDetailRepos;
    private final NotificationRepos notificationRepos;
    private final AttachmentService attachmentService;

    @Autowired
    public ConsignmentServiceImpl(ConsignmentRepos consignmentRepos, AccountRepos accountRepos,
                                  ConsignmentDetailRepos consignmentDetailRepos,
                                  NotificationRepos notificationRepos, ItemRepos itemRepos,
                                  AttachmentService attachmentService) {
        this.consignmentRepos = consignmentRepos;
        this.accountRepos = accountRepos;
        this.consignmentDetailRepos = consignmentDetailRepos;
        this.notificationRepos = notificationRepos;
        this.itemRepos = itemRepos;
        this.attachmentService = attachmentService;
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
        if (consignment.getConsignmentDetails() == null) {
            consignment.setConsignmentDetails(new ArrayList<>());
        }
        return new ConsignmentDTO(consignment);
    }

    
    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    //todo thís need to be migrated to new schema defintion no more detail
    public ConsignmentDTO requestConsignmentCreate(ConsignmentRequestDTO consignmentRequestDTO) {
        try {
            Consignment consignment = new Consignment();
//            ConsignmentDetail detail = new ConsignmentDetail();
//            detail.setDescription(consignmentDetails.getDescription());
//            detail.setPrice(consignmentDetails.getPrice());
//            detail.setType(ConsignmentDetail.ConsignmentType.REQUEST);
//            detail.setAccount(accountRepos.findById(userId).orElseThrow(() -> new ConsignmentServiceException("User not found")));
            consignment.setPreferContact(Consignment.preferContact.valueOf(consignmentRequestDTO.getPreferContact().toUpperCase()));
            consignment.setCreateDate(LocalDateTime.now());
            consignment.setUpdateDate(LocalDateTime.now());
            consignment.setConsignmentDetails(new ArrayList<>());
            consignment.setColor(consignmentRequestDTO.getColor());
            consignment.setMetal(consignmentRequestDTO.getMetal());
            consignment.setGemstone(consignmentRequestDTO.getGemstone());
            consignment.setStamped(consignmentRequestDTO.getStamped());
            consignment.setMeasurement(consignmentRequestDTO.getMeasurement());
            consignment.setCondition(consignmentRequestDTO.getCondition());
            consignment.setWeight(consignmentRequestDTO.getWeight());
            consignment.setStatus(Consignment.Status.WAITING_STAFF);
            consignment.setDescription(consignmentRequestDTO.getDescription());
            consignment.setUser(accountRepos.findById(consignmentRequestDTO.getAccountId()).orElseThrow(() -> new ConsignmentServiceException("User not found")));
            consignment.setContactEmail(consignmentRequestDTO.getEmail());
            consignment.setContactName(consignmentRequestDTO.getContactName());
            consignment.setContactPhone(consignmentRequestDTO.getPhone());
//                consignment.setConsignmentDetails(List.of(detail));
            consignment = consignmentRepos.save(consignment);
            if (consignmentRequestDTO.getFiles() != null) {
                for (MultipartFile f : consignmentRequestDTO.getFiles()) {
                    attachmentService.uploadConsignmentAttachment(f, consignment.getConsignmentId());
                }
            }
//            detail.setConsignment(consignment);
//            consignmentDetailRepos.save(detail);
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error creating consignment", e);
            throw new ConsignmentServiceException("Error creating consignment", e);
        }
    }

    
    //todo: this need to be migrated to the new entity definition this one neeed a neww detail
    @Override
    //@CacheEvict(value = "consignments", allEntries = true)

    public ConsignmentDetailDTO submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId) {
        try {
            if(price.compareTo(BigDecimal.valueOf(100)) < 0){
                throw new ConsignmentServiceException("Price must be greater than 100");
            }
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                    detail.getType().equals(ConsignmentDetail.ConsignmentType.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation already submitted");
            }
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setType(ConsignmentDetail.ConsignmentType.INITIAL_EVALUATION);
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

            return new ConsignmentDetailDTO(detail);
        } catch (Exception e) {
            logger.error("Error submitting initial evaluation", e);
            throw new ConsignmentServiceException("Error submitting initial evaluation");
        }
    }

    
    //todo: this need to be migrated to the new entity definition
    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDetailDTO submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId) {

        try {
            if(price.compareTo(BigDecimal.valueOf(100)) < 0){
                throw new ConsignmentServiceException("Price must be greater than 100");
            }
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getConsignmentDetails().stream().noneMatch(detail ->
                    detail.getType().equals(ConsignmentDetail.ConsignmentType.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation not submitted");
            }
            int countFin = 0;
            int countRej = 0;
            for (ConsignmentDetail detail : consignment.getConsignmentDetails()) {
                if (detail.getType().equals(ConsignmentDetail.ConsignmentType.FINAL_EVALUATION)) {
                    countFin++;
                }
                if (detail.getType().equals(ConsignmentDetail.ConsignmentType.MANAGER_REJECTED)) {
                    countRej++;
                }
            }
            if (countFin > countRej) {
                throw new ConsignmentServiceException("Final Evaluation already submitted");
            }

            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setType(ConsignmentDetail.ConsignmentType.FINAL_EVALUATION);
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

            return new ConsignmentDetailDTO(detail);
        } catch (Exception e) {
            logger.error("Error submitting final evaluation", e);
            throw new ConsignmentServiceException("Error submitting final evaluation");
        }
    }

    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    
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
    //@CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDTO approveFinalEvaluation(int consignmentId, int accountId, String description) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElse(null);
            if (consignment == null) {
                throw new ConsignmentServiceException("Consignment not found");
            }
            Account account = accountRepos.findById(accountId).orElseThrow(() -> new ConsignmentServiceException("Account not found"));
            if (!account.getRole().equals(Account.Role.MANAGER)) {
                throw new ConsignmentServiceException("Account is not manager");
            }
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION)
                    && consignment.getConsignmentDetails().stream().anyMatch(detail -> detail.getType().equals(ConsignmentDetail.ConsignmentType.FINAL_EVALUATION))) {

                ConsignmentDetail consignmentDetail = new ConsignmentDetail();
                consignmentDetail.setAccount(account);
                consignmentDetail.setConsignment(consignment);
                consignmentDetail.setPrice(null);
                consignmentDetail.setDescription(null);
                consignmentDetail.setType(ConsignmentDetail.ConsignmentType.MANAGER_ACCEPTED);
                consignmentDetail = consignmentDetailRepos.save(consignmentDetail);
                consignment.getConsignmentDetails().add(consignmentDetail);
                consignment.setStatus(Consignment.Status.WAITING_SELLER);
                return new ConsignmentDTO(consignmentRepos.save(consignment));
            } else {
                throw new ConsignmentServiceException("Consignment is not in final evaluation status");
            }
        } catch (Exception e) {
            logger.error("Error processing consignment", e);
            throw new ConsignmentServiceException("Error processing consignment", e);
        }

    }


    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDTO rejectFinalEvaluation(int consignmentId, int accountId, String rejectionReason) {
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
            if (consignment.getStatus().equals(Consignment.Status.IN_FINAL_EVALUATION) && consignment.getConsignmentId() == consignmentId) {
                // Create and set consignment detail
                ConsignmentDetail consignmentDetail = new ConsignmentDetail();
                consignmentDetail.setAccount(account);
                consignmentDetail.setConsignment(consignment);
                consignmentDetail.setPrice(null);
                consignmentDetail.setDescription(rejectionReason);
                consignmentDetail.setType(ConsignmentDetail.ConsignmentType.MANAGER_REJECTED);
                consignmentDetail = consignmentDetailRepos.save(consignmentDetail);
                consignment.getConsignmentDetails().add(consignmentDetail);

                return new ConsignmentDTO(consignmentRepos.save(consignment));
            } else {
                throw new ConsignmentServiceException("Consignment is not in final evaluation status");
            }
        } catch (Exception e) {
            logger.error("Error processing consignment", e);
            throw new ConsignmentServiceException("Error processing consignment", e);
        }
    }


    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    public ConsignmentDTO custAcceptInitialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.IN_INITIAL_EVALUATION)) {
                consignment.setStatus(Consignment.Status.SENDING);
                SecureRandom random = new SecureRandom();
                String code;
                do {
                    byte[] bytes = new byte[5];
                    random.nextBytes(bytes);
                    StringBuilder hexString = new StringBuilder();
                    for (byte b : bytes)
                        hexString.append(String.format("%02x", b));
                    code = hexString.substring(0, 9);
                } while (consignmentRepos.existsBySecretCodeIgnoreCase(code));
                consignment.setSecretCode(code);
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
    //@CacheEvict(value = "consignments", allEntries = true)
    
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
    //@CacheEvict(value = "consignments", allEntries = true)
    
    public ConsignmentDTO custAcceptFinaltialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.WAITING_SELLER)) {
                consignment.setStatus(Consignment.Status.TO_ITEM);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in IN_FINAL_EVALUATION status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error accepting Final evaluation", e);
            throw new ConsignmentServiceException("Error accepting final evaluation", e);
        }
    }

    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    
    public ConsignmentDTO custRejectFinaltialEvaluation(int consignmentId) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            if (consignment.getStatus().equals(Consignment.Status.WAITING_SELLER)) {
                consignment.setStatus(Consignment.Status.TERMINATED);
                consignmentRepos.save(consignment);
            } else {
                throw new ConsignmentServiceException("Consignment is not in WAITING_SELLER status");
            }
            return getConsignmentDTO(consignment);
        } catch (Exception e) {
            logger.error("Error rejecting final evaluation", e);
            throw new ConsignmentServiceException("Error rejecting Final evaluation", e);
        }
    }


    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    
    public void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment) {
        try {
            Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
            consignment.setPreferContact(Consignment.preferContact.valueOf(updatedConsignment.getPreferContact().toUpperCase()));
            consignment.setCreateDate(updatedConsignment.getCreateDate());
            consignment.setUpdateDate(updatedConsignment.getUpdateDate());
            consignment.setStatus(Consignment.Status.valueOf(updatedConsignment.getStatus().toUpperCase()));
            consignment.setColor(updatedConsignment.getColor());
            consignment.setWeight(updatedConsignment.getWeight());
            consignment.setMetal(updatedConsignment.getMetal());
            consignment.setGemstone(updatedConsignment.getGemstone());
            consignment.setCondition(updatedConsignment.getCondition());
            consignment.setStamped(updatedConsignment.getStamped());
            consignment.setMeasurement(updatedConsignment.getMeasurement());
            consignment.setDescription(updatedConsignment.getDescription());

            consignment.setUser(updatedConsignment.getUser() == null ? null : accountRepos.findById(updatedConsignment.getUser().getAccountId()).orElseThrow(() -> new ConsignmentServiceException("Account not found")));

            Notification notification = new Notification();
            notification.setAccount(consignment.getUser());
            if (consignment.getUser() != null) {
                notification.setMessage("Update Consignment By " + consignment.getUser().getNickname() + " " + consignment.getUser().getRole());
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
    public void updateConsignmentByStatus(UpdateConsignmentStatusRequestDTO consignmentDTO) {
        for (Integer consignmentId : consignmentDTO.getConsignmentId()) {
            try {
                Consignment consignments = consignmentRepos.findByConsignmentId(consignmentId);
                if (consignments != null) {
                    consignments.setStatus(Consignment.Status.valueOf(consignmentDTO.getStatus().toUpperCase()));
                    consignmentRepos.save(consignments);
                } else {
                    throw new ResourceNotFoundException("Consignment not found with ID: " + consignmentId);
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + consignmentDTO.getStatus().toUpperCase());
            } catch (Exception e) {
                throw new ConsignmentServiceException("An error occurred while updating consignment with ID: " + consignmentId);
            }
        }
    }

    @Override
    public ConsignmentDTO getConsignmentById(int id) {
        return consignmentRepos.findById(id).map(this::getConsignmentDTO).orElseThrow(() -> new ConsignmentServiceException("Consignment not found"));
    }

    //TODO : redesing the logic for get all staff consignment this need refactor
    @Override
    public Page<ConsignmentDTO> getAllStaffConsignments(int staffId,Pageable pageable) {
        Page<Consignment> consignmentPage = consignmentRepos.findByStatusOrStaff_AccountId(Consignment.Status.WAITING_STAFF,staffId,pageable);
        return getConsignmentDTOS(pageable, consignmentPage);
    }

    @Override
   //@Cacheable(key = "'consignmentsPage:' + #pageable.pageNumber + 'size:' + #pageable.pageSize + 'sort:' + #pageable.sort+ 'status:'+#status", value = "consignments")
    public Page<ConsignmentDTO> getConsignmentsByStatus(String status, Pageable
            pageable, int accID) {
        Consignment.Status enumStatus = Consignment.Status.valueOf(status.toUpperCase());
        if(Consignment.Status.WAITING_STAFF.equals(enumStatus)){
            return consignmentRepos.findByStatus(enumStatus, pageable).map(this::getConsignmentDTO);
        }
        Account.Role role = accountRepos.findById(accID).orElseThrow(
                ()-> new ResourceNotFoundException("Account not found")).getRole();
        try {
            Page<Consignment> consignmentPage;
            if (role.equals(Account.Role.valueOf("MANAGER")) ||
                    role.equals(Account.Role.valueOf("ADMIN"))) {
                consignmentPage = consignmentRepos.findByStatus(enumStatus, pageable);
            }else if(role.equals(Account.Role.valueOf("STAFF"))){
                //todo: this need to be migrated to the new schema definition
                consignmentPage = consignmentRepos.findByStatusAndStaff_AccountId(enumStatus,accID, pageable);
            }else{
                return null;
            }
            return consignmentPage.map(this::getConsignmentDTO);
        } catch (IllegalArgumentException e) {
            throw new ConsignmentServiceException("Invalid status value: " + status, e);
        }
    }

    @Override
   //@Cacheable(key = "#userId + #pageable.pageNumber + #pageable.pageSize", value = "consignments")
    public Page<ConsignmentDTO> getConsignmentsByUserId(int userId,Pageable pageable ){
        Page<Consignment> consignmentPage = consignmentRepos.findAllByUser_AccountId(userId, pageable);
//        consignmentPage.stream().filter(consignment -> consignment.getStatus().equals(Consignment.Status.FINISHED)).forEach(consignment -> {
//            consignment.setConsignmentDetails(consignment.getConsignmentDetails().stream().filter(detail -> detail.getType().equals(ConsignmentDetail.ConsignmentType.MANAGER_ACCEPTED)).toList());
//        });

        logger.info("Retrieved consignments by user ID: " + consignmentPage.getContent().size());

        return getConsignmentDTOS(pageable, consignmentPage);

//        return PageImpl(consignmentPage.stream().map(this::getConsignmentDTO).collect(Collectors.toList()));
    }


    @Override
   //@Cacheable(key = "#consignmentId", value = "consignments")
    public Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId) {
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow();
        List<ConsignmentDetailDTO> consignmentDetailDTOs = new ArrayList<>();
        for (ConsignmentDetail detail : consignment.getConsignmentDetails()) {
            consignmentDetailDTOs.add(ConsignmentDetailDTO.builder()
                    .consignmentDetailId(detail.getConsignmentDetailId())
                    .description(detail.getDescription())
                    .type(detail.getType())
                    .price(detail.getPrice())
                    .consignmentId(detail.getConsignment().getConsignmentId())
                    .account(AccountDTO.redacted(detail.getAccount()))
                    .attachments(detail.getAttachments().stream().map(AttachmentDTO::new).toList())
                    .createDate(detail.getCreateDate())
                    .build());
        }
        return new PageImpl<>(consignmentDetailDTOs);
    }

    @Override
    public Page<ConsignmentDTO> getAllConsignments(Pageable pageable,
                                                   @Nullable Consignment.Status status,
                                                   @Nullable LocalDateTime from, @Nullable LocalDateTime to,
                                                   @Nullable Integer customer, @Nullable String search) {
        ConsignmentSpecification spec = new ConsignmentSpecification(status, from, to, customer, search);
        Page<Consignment> consignmentPage = consignmentRepos.findAll(spec,pageable);
        return getConsignmentDTOS(pageable, consignmentPage);
    }

    
    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
    public ResponseEntity<ConsignmentDTO> deleteConsignment(int id) {
        if (consignmentRepos.findByConsignmentId(id) == null) {
            throw new ConsignmentServiceException("Consignment not found");
        }
        consignmentRepos.deleteById(id);

        return null;
    }

    
    //Todo: refactor this to be the first consignment detail of the consignment
    @Override
    //@CacheEvict(value = "consignments", allEntries = true)
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
    //@CacheEvict(value = "consignments", allEntries = true)
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

    @Override
    public void finishItem(Integer consignmentId, Integer itemId) {
        Consignment consignment = consignmentRepos.findById(consignmentId).orElseThrow(
                () -> new ConsignmentServiceException("Consignment not found : " + consignmentId));
        if (consignment.getStatus().equals(Consignment.Status.TO_ITEM)) {
            consignment.setStatus(Consignment.Status.FINISHED);
            consignment.setCreatedItem(itemRepos.findById(itemId).orElseThrow(
                    () -> new ResourceNotFoundException("Item not found : " + itemId))
            );
            consignmentRepos.save(consignment);
        } else {
            throw new ConsignmentServiceException("Consignment is not in TO_ITEM status");
        }
    }


}

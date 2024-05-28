package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ConsignmentDetailRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.ConsignmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ConsignmentServiceImplTest {

    @InjectMocks
    private ConsignmentServiceImpl consignmentService;

    @Mock
    private ConsignmentRepos consignmentRepos;

    @Mock
    private AccountRepos accountRepos;

    @Mock
    private AccountService accountService;

    @Mock
    private ConsignmentDetailRepos consignmentDetailRepos;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void requestConsignmentCreate_HappyPath() {
        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(new Account()));
        when(consignmentRepos.save(any(Consignment.class))).thenReturn(new Consignment());

        ConsignmentDetailDTO consignmentDetails = new ConsignmentDetailDTO();
        consignmentDetails.setDescription("description");

        ConsignmentDTO result = consignmentService.requestConsignmentCreate(1, "email", consignmentDetails);

        assertNotNull(result);
        verify(consignmentRepos, times(1)).save(any(Consignment.class));
        verify(consignmentDetailRepos, times(1)).save(any(ConsignmentDetail.class));
    }

    @Test
    public void submitInitialEvaluation_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setConsignmentDetails(Collections.emptyList());

        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));
        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(new Account()));

        consignmentService.submitInitialEvaluation(2, "evaluation", BigDecimal.valueOf(1000), 1, Collections.emptyList());

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
    }

    @Test
    public void submitFinalEvaluationUpdate_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setConsignmentId(1);
        ConsignmentDetail consignmentDetail = new ConsignmentDetail();
        consignmentDetail.setConsignmentDetailId(1);
        consignmentDetail.setPrice(BigDecimal.valueOf(1000));
        consignmentDetail.setAccount(new Account());
        consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION);
        consignment.setConsignmentDetails(new ArrayList<>(Collections.singletonList(consignmentDetail)));
        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));
        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(new Account()));

        consignmentService.submitFinalEvaluationUpdate(1, "evaluation", BigDecimal.valueOf(1000), 1, Collections.emptyList());

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
    }

    @Test
    public void confirmJewelryReceived_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setStatus(Consignment.Status.SENDING);

        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));

        consignmentService.confirmJewelryReceived(1);

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
    }

    @Test
    public void approveFinalEvaluation_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setConsignmentId(1);
        consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);
        consignment.setConsignmentDetails(Collections.emptyList());
        ConsignmentDetail consignmentDetail = new ConsignmentDetail();
        consignmentDetail.setType(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION);
        consignment.setConsignmentDetails(new ArrayList<>(Collections.singletonList(consignmentDetail)));
        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));
        when(accountService.getAccountById(anyInt())).thenReturn(new AccountDTO());

        consignmentService.approveFinalEvaluation(1, 1, "description");

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
        verify(consignmentDetailRepos, times(1)).save(any(ConsignmentDetail.class));
    }

    @Test
    public void rejectFinalEvaluation_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setConsignmentId(1);
        consignment.setStatus(Consignment.Status.IN_FINAL_EVALUATION);
        consignment.setConsignmentDetails(Collections.emptyList());

        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));
        when(accountService.getAccountById(anyInt())).thenReturn(new AccountDTO());

        consignmentService.rejectFinalEvaluation(1, 1, "rejectionReason");

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
        verify(consignmentDetailRepos, times(1)).save(any(ConsignmentDetail.class));
    }

    @Test
    public void updateConsignment_HappyPath() {
        Consignment consignment = new Consignment();
        consignment.setConsignmentId(1);

        when(consignmentRepos.findById(anyInt())).thenReturn(Optional.of(consignment));

        ConsignmentDTO updatedConsignment = new ConsignmentDTO();
        updatedConsignment.setPreferContact("email");
        updatedConsignment.setStatus("WAITING_STAFF");

        consignmentService.updateConsignment(1, updatedConsignment);

        verify(consignmentRepos, times(1)).save(any(Consignment.class));
    }
}
//package fpt.edu.vn.Backend.serviceTest;
//
//import fpt.edu.vn.Backend.DTO.AccountDTO;
//import fpt.edu.vn.Backend.DTO.AttachmentDTO;
//import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
//import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
//import fpt.edu.vn.Backend.pojo.Account;
//import fpt.edu.vn.Backend.pojo.Attachment;
//import fpt.edu.vn.Backend.pojo.Consignment;
//import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
//import fpt.edu.vn.Backend.repository.AccountRepos;
//import fpt.edu.vn.Backend.repository.AttachmentRepos;
//import fpt.edu.vn.Backend.repository.ConsignmentDetailRepos;
//import fpt.edu.vn.Backend.repository.ConsignmentRepos;
//import fpt.edu.vn.Backend.service.ConsignmentDetailServiceImpl;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//
//import java.math.BigDecimal;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class ConsignmentDetailServiceImplTest {
//
//    @Mock
//    private ConsignmentDetailRepos consignmentDetailRepos;
//
//    @Mock
//    private AttachmentRepos attachmentRepos;
//
//    @Mock
//    private AccountRepos accountRepos;
//
//    @Mock
//    private ConsignmentRepos consignmentRepos;
//
//    @InjectMocks
//    private ConsignmentDetailServiceImpl consignmentDetailService;
//
//    private ConsignmentDetail consignmentDetail1;
//    private ConsignmentDetail consignmentDetail2;
//    private Consignment consignment;
//    private Account account;
//    private Attachment attachment;
//    private ConsignmentDetailDTO consignmentDetailDTO;
//
//    @BeforeEach
//    void setUp() {
//        consignment = new Consignment();
//        consignment.setConsignmentId(1);
//
//        account = new Account();
//        account.setAccountId(1);
//
//        attachment = new Attachment();
//        attachment.setAttachmentId(1);
//
//        consignmentDetail1 = new ConsignmentDetail();
//        consignmentDetail1.setConsignmentDetailId(1);
//        consignmentDetail1.setConsignment(consignment);
//        consignmentDetail1.setAccount(account);
//        consignmentDetail1.setDescription("Description 1");
//        consignmentDetail1.setPrice(BigDecimal.valueOf(100.0));
//        consignmentDetail1.setStatus(ConsignmentDetail.ConsignmentStatus.REQUEST);
//        consignmentDetail1.setAttachments(Arrays.asList(attachment));
//
//        consignmentDetail2 = new ConsignmentDetail();
//        consignmentDetail2.setConsignmentDetailId(2);
//        consignmentDetail2.setConsignment(consignment);
//        consignmentDetail2.setAccount(account);
//        consignmentDetail2.setDescription("Description 2");
//        consignmentDetail2.setPrice(BigDecimal.valueOf(200.0));
//        consignmentDetail2.setStatus(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION);
//        consignmentDetail2.setAttachments(Arrays.asList(attachment));
//
//        consignmentDetailDTO = new ConsignmentDetailDTO();
//        consignmentDetailDTO.setConsignmentDetailId(1);
//        consignmentDetailDTO.setConsignmentId(consignment.getConsignmentId());
//        consignmentDetailDTO.setAccount(new AccountDTO(account));
//        consignmentDetailDTO.setDescription("Description 1");
//        consignmentDetailDTO.setPrice(BigDecimal.valueOf(100.0));
//        consignmentDetailDTO.setStatus("REQUEST");
//        consignmentDetailDTO.setAttachments(Arrays.asList(new AttachmentDTO(attachment)));
//    }
//
//    @Test
//    void testGetAllConsignmentsDetail() {
//        Pageable pageable = PageRequest.of(0, 10);
//        List<ConsignmentDetail> consignmentDetailList = Arrays.asList(consignmentDetail1, consignmentDetail2);
//        Page<ConsignmentDetail> consignmentDetailPage = new PageImpl<>(consignmentDetailList, pageable, consignmentDetailList.size());
//
//        when(consignmentDetailRepos.findAll(pageable)).thenReturn(consignmentDetailPage);
//
//        Page<ConsignmentDetailDTO> result = consignmentDetailService.getAllConsignmentsDetail(pageable);
//
//        verify(consignmentDetailRepos, times(1)).findAll(pageable);
//        assertNotNull(result);
//        assertEquals(2, result.getTotalElements());
//        assertEquals(2, result.getContent().size());
//
//        ConsignmentDetailDTO dto1 = result.getContent().get(0);
//        ConsignmentDetailDTO dto2 = result.getContent().get(1);
//
//        assertEquals(consignmentDetail1.getConsignmentDetailId(), dto1.getConsignmentDetailId());
//        assertEquals(consignmentDetail1.getDescription(), dto1.getDescription());
//        assertEquals(consignmentDetail1.getPrice(), dto1.getPrice());
//        assertEquals(consignmentDetail1.getStatus().name(), dto1.getStatus());
//
//        assertEquals(consignmentDetail2.getConsignmentDetailId(), dto2.getConsignmentDetailId());
//        assertEquals(consignmentDetail2.getDescription(), dto2.getDescription());
//        assertEquals(consignmentDetail2.getPrice(), dto2.getPrice());
//        assertEquals(consignmentDetail2.getStatus().name(), dto2.getStatus());
//    }
//
//    @Test
//    void testGetConsignmentsDetailByConsignmentId() {
//        when(consignmentDetailRepos.findDistinctByConsignment_ConsignmentId(1)).thenReturn(Arrays.asList(consignmentDetail1, consignmentDetail2));
//
//        List<ConsignmentDetailDTO> result = consignmentDetailService.getConsignmentsDetailByConsignmentId(1);
//
//        verify(consignmentDetailRepos, times(1)).findDistinctByConsignment_ConsignmentId(1);
//        assertNotNull(result);
//        assertEquals(2, result.size());
//
//        ConsignmentDetailDTO dto1 = result.get(0);
//        ConsignmentDetailDTO dto2 = result.get(1);
//
//        assertEquals(consignmentDetail1.getConsignmentDetailId(), dto1.getConsignmentDetailId());
//        assertEquals(consignmentDetail1.getDescription(), dto1.getDescription());
//        assertEquals(consignmentDetail1.getPrice(), dto1.getPrice());
//        assertEquals(consignmentDetail1.getStatus().name(), dto1.getStatus());
//
//        assertEquals(consignmentDetail2.getConsignmentDetailId(), dto2.getConsignmentDetailId());
//        assertEquals(consignmentDetail2.getDescription(), dto2.getDescription());
//        assertEquals(consignmentDetail2.getPrice(), dto2.getPrice());
//        assertEquals(consignmentDetail2.getStatus().name(), dto2.getStatus());
//    }
//    @Test
//    void testGetConsignmentDetailById() {
//        when(consignmentDetailRepos.findById(1)).thenReturn(Optional.of(consignmentDetail1));
//
//        ConsignmentDetailDTO result = consignmentDetailService.getConsignmentDetailById(1);
//
//        verify(consignmentDetailRepos, times(1)).findById(1);
//        assertNotNull(result);
//        assertEquals(consignmentDetail1.getConsignmentDetailId(), result.getConsignmentDetailId());
//        assertEquals(consignmentDetail1.getDescription(), result.getDescription());
//        assertEquals(consignmentDetail1.getPrice(), result.getPrice());
//        assertEquals(consignmentDetail1.getStatus().name(), result.getStatus());
//    }
//
//    @Test
//    void testCreateConsignmentDetail() {
//        when(consignmentRepos.findByConsignmentId(1)).thenReturn(consignment);
//        when(accountRepos.findById(1)).thenReturn(Optional.of(account));
//        when(attachmentRepos.findById(1)).thenReturn(Optional.of(attachment));
//        when(consignmentDetailRepos.save(any(ConsignmentDetail.class))).thenReturn(consignmentDetail1);
//
//        ConsignmentDetailDTO result = consignmentDetailService.createConsignmentDetail(consignmentDetailDTO);
//
//        verify(consignmentRepos, times(1)).findByConsignmentId(1);
//        verify(accountRepos, times(1)).findById(1);
//        verify(attachmentRepos, times(1)).findById(1);
//        verify(consignmentDetailRepos, times(1)).save(any(ConsignmentDetail.class));
//
//        assertNotNull(result);
//        assertEquals(consignmentDetailDTO.getConsignmentDetailId(), result.getConsignmentDetailId());
//        assertEquals(consignmentDetailDTO.getDescription(), result.getDescription());
//        assertEquals(consignmentDetailDTO.getPrice(), result.getPrice());
//        assertEquals(consignmentDetailDTO.getStatus(), result.getStatus());
//    }
//
//    @Test
//    void testUpdateConsignmentDetail() {
//        when(consignmentDetailRepos.findById(1)).thenReturn(Optional.of(consignmentDetail1));
//        when(consignmentRepos.findByConsignmentId(1)).thenReturn(consignment);
//        when(accountRepos.findById(1)).thenReturn(Optional.of(account));
//        when(attachmentRepos.findById(1)).thenReturn(Optional.of(attachment));
//        when(consignmentDetailRepos.save(any(ConsignmentDetail.class))).thenReturn(consignmentDetail1);
//
//        ConsignmentDetailDTO updatedConsignmentDetailDTO = new ConsignmentDetailDTO();
//        updatedConsignmentDetailDTO.setConsignmentDetailId(1);
//        updatedConsignmentDetailDTO.setConsignmentId(1);
//        updatedConsignmentDetailDTO.setAccount(new AccountDTO(account));
//        updatedConsignmentDetailDTO.setDescription("Updated Description");
//        updatedConsignmentDetailDTO.setPrice(BigDecimal.valueOf(150.0));
//        updatedConsignmentDetailDTO.setStatus("REQUEST");
//        updatedConsignmentDetailDTO.setAttachments(Arrays.asList(new AttachmentDTO(attachment)));
//
//        ConsignmentDetailDTO result = consignmentDetailService.updateConsignmentDetail(1, updatedConsignmentDetailDTO);
//
//        verify(consignmentDetailRepos, times(1)).findById(1);
//        verify(consignmentRepos, times(1)).findByConsignmentId(1);
//        verify(accountRepos, times(1)).findById(1);
//        verify(attachmentRepos, times(1)).findById(1);
//        verify(consignmentDetailRepos, times(1)).save(any(ConsignmentDetail.class));
//        assertNotNull(result);
//        assertEquals(updatedConsignmentDetailDTO.getConsignmentDetailId(), result.getConsignmentDetailId());
//        assertEquals(updatedConsignmentDetailDTO.getDescription(), result.getDescription());
//        assertEquals(updatedConsignmentDetailDTO.getPrice(), result.getPrice());
//        assertEquals(updatedConsignmentDetailDTO.getStatus(), result.getStatus());
//    }
//    @Test
//    void createConsignmentDetail_HappyPath() {
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(consignment);
//        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(account));
//        when(attachmentRepos.findById(anyInt())).thenReturn(Optional.of(attachment));
//        when(consignmentDetailRepos.save(any(ConsignmentDetail.class))).thenReturn(consignmentDetail1);
//
//        ConsignmentDetailDTO result = consignmentDetailService.createConsignmentDetail(consignmentDetailDTO);
//
//        assertNotNull(result);
//        assertEquals(consignmentDetailDTO.getConsignmentDetailId(), result.getConsignmentDetailId());
//        assertEquals(consignmentDetailDTO.getDescription(), result.getDescription());
//        assertEquals(consignmentDetailDTO.getPrice(), result.getPrice());
//        assertEquals(consignmentDetailDTO.getStatus(), result.getStatus());
//    }
//
//    @Test
//    void createConsignmentDetail_ConsignmentNotFound() {
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(null);
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.createConsignmentDetail(consignmentDetailDTO));
//    }
//
//    @Test
//    void updateConsignmentDetail_HappyPath() {
//        when(consignmentDetailRepos.findById(anyInt())).thenReturn(Optional.of(consignmentDetail1));
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(consignment);
//        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(account));
//        when(attachmentRepos.findById(anyInt())).thenReturn(Optional.of(attachment));
//        when(consignmentDetailRepos.save(any(ConsignmentDetail.class))).thenReturn(consignmentDetail1);
//
//        ConsignmentDetailDTO updatedConsignmentDetailDTO = new ConsignmentDetailDTO();
//        updatedConsignmentDetailDTO.setConsignmentDetailId(1);
//        updatedConsignmentDetailDTO.setConsignmentId(1);
//        updatedConsignmentDetailDTO.setAccount(new AccountDTO(account));
//        updatedConsignmentDetailDTO.setDescription("Updated Description");
//        updatedConsignmentDetailDTO.setPrice(BigDecimal.valueOf(150.0));
//        updatedConsignmentDetailDTO.setStatus("REQUEST");
//        updatedConsignmentDetailDTO.setAttachments(Arrays.asList(new AttachmentDTO(attachment)));
//
//        ConsignmentDetailDTO result = consignmentDetailService.updateConsignmentDetail(1, updatedConsignmentDetailDTO);
//
//        assertNotNull(result);
//        assertEquals(updatedConsignmentDetailDTO.getConsignmentDetailId(), result.getConsignmentDetailId());
//        assertEquals(updatedConsignmentDetailDTO.getDescription(), result.getDescription());
//        assertEquals(updatedConsignmentDetailDTO.getPrice(), result.getPrice());
//        assertEquals(updatedConsignmentDetailDTO.getStatus(), result.getStatus());
//    }
//
//    @Test
//    void updateConsignmentDetail_ConsignmentDetailNotFound() {
//        when(consignmentDetailRepos.findById(anyInt())).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.updateConsignmentDetail(1, consignmentDetailDTO));
//    }
//
//    @Test
//    void testGetConsignmentDetailById_NotFound() {
//        when(consignmentDetailRepos.findById(anyInt())).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.getConsignmentDetailById(1));
//    }
//
//    @Test
//    void testCreateConsignmentDetail_AccountNotFound() {
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(consignment);
//        when(accountRepos.findById(anyInt())).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.createConsignmentDetail(consignmentDetailDTO));
//    }
//
//    @Test
//    void testCreateConsignmentDetail_AttachmentNotFound() {
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(consignment);
//        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(account));
//        when(attachmentRepos.findById(anyInt())).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.createConsignmentDetail(consignmentDetailDTO));
//    }
//
//    @Test
//    void testUpdateConsignmentDetail_ConsignmentNotFound() {
//        when(consignmentDetailRepos.findById(anyInt())).thenReturn(Optional.of(consignmentDetail1));
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(null);
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.updateConsignmentDetail(1, consignmentDetailDTO));
//    }
//
//    @Test
//    void testUpdateConsignmentDetail_AccountNotFound() {
//        when(consignmentDetailRepos.findById(anyInt())).thenReturn(Optional.of(consignmentDetail1));
//        when(consignmentRepos.findByConsignmentId(anyInt())).thenReturn(consignment);
//        when(accountRepos.findById(anyInt())).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> consignmentDetailService.updateConsignmentDetail(1, consignmentDetailDTO));
//    }
//
//}




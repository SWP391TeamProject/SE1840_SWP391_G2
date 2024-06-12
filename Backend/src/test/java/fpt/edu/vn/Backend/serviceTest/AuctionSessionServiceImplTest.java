package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.service.AuctionSessionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuctionSessionServiceImplTest {
    @Mock
    private AuctionSessionRepos auctionSessionRepos;

    @InjectMocks
    private AuctionSessionServiceImpl auctionSessionService;

    @Mock
    private AuctionSession auctionSession;
    @Mock
    private AuctionSessionDTO auctionSessionDTO;

    @BeforeEach
    public void setUp() {
        auctionSession = new AuctionSession();
        auctionSession.setAuctionSessionId(1);
        auctionSession.setStartDate(LocalDateTime.now().minusDays(1));
        auctionSession.setEndDate(LocalDateTime.now().plusDays(1));
        auctionSession.setCreateDate(LocalDateTime.now().minusDays(2));
        auctionSession.setUpdateDate(LocalDateTime.now());
        auctionSession.setStatus(AuctionSession.Status.FINISHED);

        auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setAuctionSessionId(1);
        auctionSessionDTO.setStartDate(auctionSession.getStartDate());
        auctionSessionDTO.setEndDate(auctionSession.getEndDate());
        auctionSessionDTO.setCreateDate(auctionSession.getCreateDate());
        auctionSessionDTO.setUpdateDate(auctionSession.getUpdateDate());
        auctionSessionDTO.setStatus(auctionSession.getStatus().toString());
    }

    @Test
    public void testCreateAuctionSession() {


        when(auctionSessionRepos.save(any(AuctionSession.class))).thenReturn(auctionSession);
        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());
        AuctionSessionDTO result = auctionSessionService.createAuctionSession(auctionSessionDTO);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).save(any(AuctionSession.class));
    }

    @Test
    @DisplayName("Should update auction session successfully")
    public void shouldUpdateAuctionSessionSuccessfully() {
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));
        when(auctionSessionRepos.save(any(AuctionSession.class))).thenReturn(auctionSession);
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        AuctionSessionDTO result = auctionSessionService.updateAuctionSession(auctionSessionDTO);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).findById(1);
        verify(auctionSessionRepos, times(1)).save(any(AuctionSession.class));
    }

    @Test
    @DisplayName("Should throw exception when start date is in the past")
    public void shouldThrowExceptionWhenStartDateIsInThePast() {
        auctionSessionDTO.setStartDate(LocalDateTime.now().minusDays(1));

        assertThrows(InvalidInputException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    @DisplayName("Should throw exception when end date is before start date")
    public void shouldThrowExceptionWhenEndDateIsBeforeStartDate() {
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now());

        assertThrows(InvalidInputException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    @DisplayName("Should throw exception when auction session not found")
    public void shouldThrowExceptionWhenAuctionSessionNotFound() {
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.empty());
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }


    @Test
    @DisplayName("Test get auction session by id")
    public void testGetAuctionSessionById() {
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));

        AuctionSessionDTO result = auctionSessionService.getAuctionSessionById(1);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).findById(1);
    }


    @Test
    @DisplayName("Test get all auction sessions")
    void testGetAllAuctionSessions() {
        Pageable pageable = PageRequest.of(0, 50);
        Page<AuctionSession> auctionSessionPage = new PageImpl<>(Arrays.asList(auctionSession));
        when(auctionSessionRepos.findAll(pageable)).thenReturn(auctionSessionPage);

        Page<AuctionSessionDTO> result = auctionSessionService.getAllAuctionSessions(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(auctionSessionRepos, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("Test get past auction sessions")
    void testGetPastAuctionSessions() {
        Pageable pageable = PageRequest.of(0, 50);
        Page<AuctionSession> auctionSessionPage = new PageImpl<>(Arrays.asList(auctionSession));
        when(auctionSessionRepos.findByEndDateBefore(any(LocalDateTime.class), eq(pageable))).thenReturn(auctionSessionPage);

        Page<AuctionSessionDTO> result = auctionSessionService.getPastAuctionSessions(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(auctionSessionRepos, times(1)).findByEndDateBefore(any(LocalDateTime.class), eq(pageable));
    }

    @Test
    @DisplayName("Test get upcoming auction sessions")
    void testGetUpcomingAuctionSessions() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<AuctionSession> auctionSessionPage = new PageImpl<>(Arrays.asList(auctionSession));
        when(auctionSessionRepos.findByStartDateAfter(any(LocalDateTime.class), eq(pageable))).thenReturn(auctionSessionPage);

        Page<AuctionSessionDTO> result = auctionSessionService.getUpcomingAuctionSessions(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(auctionSessionRepos, times(1)).findByStartDateAfter(any(LocalDateTime.class), eq(pageable));
    }

    @Test
    @DisplayName("Test get auction session by id - Success")
    public void testGetAuctionSessionById_Success_WithNullDeposits() {
        auctionSession.setAuctionSessionId(1);
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));

        AuctionSessionDTO result = auctionSessionService.getAuctionSessionById(1);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).findById(1);
    }

    @Test
    void createAuctionSession_HappyPath() {
        when(auctionSessionRepos.save(any())).thenReturn(new AuctionSession());

        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertNotNull(auctionSessionService.createAuctionSession(auctionSessionDTO));
    }

    @Test
    void createAuctionSession_StartDateInThePast() {
        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setStartDate(LocalDateTime.now().minusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertThrows(InvalidInputException.class, () -> auctionSessionService.createAuctionSession(auctionSessionDTO));
    }

    @Test
    void createAuctionSession_EndDateBeforeStartDate() {
        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertThrows(InvalidInputException.class, () -> auctionSessionService.createAuctionSession(auctionSessionDTO));
    }

    @Test
    void updateAuctionSession_HappyPath() {
        when(auctionSessionRepos.findById(any())).thenReturn(Optional.of(new AuctionSession()));
        when(auctionSessionRepos.save(any())).thenReturn(new AuctionSession());

        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setAuctionSessionId(1);
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertNotNull(auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    void updateAuctionSession_AuctionSessionNotFound() {
        when(auctionSessionRepos.findById(any())).thenReturn(Optional.empty());

        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setAuctionSessionId(1);
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    void updateAuctionSession_StartDateInThePast() {

        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setAuctionSessionId(1);
        auctionSessionDTO.setStartDate(LocalDateTime.now().minusDays(1));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertThrows(InvalidInputException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    void updateAuctionSession_EndDateBeforeStartDate() {
        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setAuctionSessionId(1);
        auctionSessionDTO.setStartDate(LocalDateTime.now().plusDays(2));
        auctionSessionDTO.setEndDate(LocalDateTime.now().plusDays(1));
        auctionSessionDTO.setTitle("Test");
        auctionSessionDTO.setStatus(AuctionSession.Status.SCHEDULED.toString());

        assertThrows(InvalidInputException.class, () -> auctionSessionService.updateAuctionSession(auctionSessionDTO));
    }

    @Test
    void getAuctionSessionById_AuctionSessionNotFound() {
        when(auctionSessionRepos.findById(any())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.getAuctionSessionById(1));
    }

    @Test
    void getAllAuctionSessions_NoAuctionSessionsFound() {
        when(auctionSessionRepos.findAll(PageRequest.of(0, 10))).thenReturn(Page.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.getAllAuctionSessions(PageRequest.of(0, 10)));
    }

    @Test
    void getPastAuctionSessions_NoPastAuctionSessionsFound() {
        when(auctionSessionRepos.findByEndDateBefore(any(), any())).thenReturn(Page.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.getPastAuctionSessions(PageRequest.of(0, 10)));
    }

    @Test
    void getAuctionSessionsByTitle_NoAuctionSessionsFound() {
        when(auctionSessionRepos.findByTitleContaining(any(), any())).thenReturn(Page.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.getAuctionSessionsByTitle(PageRequest.of(0, 10), "Test"));
    }

    @Test
    void getUpcomingAuctionSessions_NoUpcomingAuctionSessionsFound() {
        when(auctionSessionRepos.findByStartDateAfter(any(), any())).thenReturn(Page.empty());

        assertThrows(ResourceNotFoundException.class, () -> auctionSessionService.getUpcomingAuctionSessions(PageRequest.of(0, 10)));
    }
}

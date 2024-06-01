package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.service.AuctionSessionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
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

        AuctionSessionDTO result = auctionSessionService.createAuctionSession(auctionSessionDTO);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).save(any(AuctionSession.class));
    }

    @Test
    public void testUpdateAuctionSession() {
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));
        when(auctionSessionRepos.save(any(AuctionSession.class))).thenReturn(auctionSession);

        AuctionSessionDTO result = auctionSessionService.updateAuctionSession(auctionSessionDTO);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).findById(1);
        verify(auctionSessionRepos, times(1)).save(any(AuctionSession.class));
    }

    @Test
    public void testGetAuctionSessionById() {
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));

        AuctionSessionDTO result = auctionSessionService.getAuctionSessionById(1);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        verify(auctionSessionRepos, times(1)).findById(1);
    }

    @Test
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
    public void testGetAuctionSessionById_Success_WithNullDeposits() {
        auctionSession.setAuctionSessionId(1);
        auctionSession.setDeposits(null); // Set deposits to null
        when(auctionSessionRepos.findById(1)).thenReturn(Optional.of(auctionSession));

        AuctionSessionDTO result = auctionSessionService.getAuctionSessionById(1);

        assertNotNull(result);
        assertEquals(auctionSession.getAuctionSessionId(), result.getAuctionSessionId());
        assertNotNull(result.getDeposits());
        assertTrue(result.getDeposits().isEmpty()); // Ensure deposits are an empty set
        verify(auctionSessionRepos, times(1)).findById(1);
    }

}

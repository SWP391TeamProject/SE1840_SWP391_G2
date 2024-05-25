package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import fpt.edu.vn.Backend.service.AuctionSessionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

public class AuctionSessionServiceImplTest {

    @InjectMocks
    private AuctionSessionServiceImpl auctionSessionService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    @DisplayName("Should return created auction session when valid DTO is provided")
    public void shouldReturnCreatedAuctionSessionWhenValidDTOIsProvided() {
        AuctionSessionDTO auctionDTO = new AuctionSessionDTO();
        // Set properties for auctionDTO

        when(auctionSessionService.createAuctionSession(any())).thenReturn(auctionDTO);

        AuctionSessionDTO result = auctionSessionService.createAuctionSession(auctionDTO);

        assertNotNull(result);
        // Assert other properties of result
    }

    @Test
    @DisplayName("Should return updated auction session when valid DTO is provided")
    public void shouldReturnUpdatedAuctionSessionWhenValidDTOIsProvided() {
        AuctionSessionDTO auctionDTO = new AuctionSessionDTO();
        // Set properties for auctionDTO

        when(auctionSessionService.updateAuctionSession(any())).thenReturn(auctionDTO);

        AuctionSessionDTO result = auctionSessionService.updateAuctionSession(auctionDTO);

        assertNotNull(result);
        // Assert other properties of result
    }

    @Test
    @DisplayName("Should return auction session when valid id is provided")
    public void shouldReturnAuctionSessionWhenValidIdIsProvided() {
        AuctionSessionDTO auctionDTO = new AuctionSessionDTO();
        // Set properties for auctionDTO

        when(auctionSessionService.getAuctionSessionById(anyInt())).thenReturn(auctionDTO);

        AuctionSessionDTO result = auctionSessionService.getAuctionSessionById(1);

        assertNotNull(result);
        // Assert other properties of result
    }

    @Test
    @DisplayName("Should return all auction sessions when valid pageable is provided")
    public void shouldReturnAllAuctionSessionsWhenValidPageableIsProvided() {
        Page<AuctionSessionDTO> page = new PageImpl<>(new ArrayList<>());
        // Add AuctionSessionDTO objects to page

        when(auctionSessionService.getAllAuctionSessions(any())).thenReturn(page);

        Page<AuctionSessionDTO> result = auctionSessionService.getAllAuctionSessions(PageRequest.of(0, 10));

        assertNotNull(result);
        // Assert other properties of result
    }


}

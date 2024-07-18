package fpt.edu.vn.Backend.serviceTest;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class ExceptionCatchTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testResourceNotFoundException() throws Exception {
        mockMvc.perform(get("/test-only/resourceNotFound"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Resource not found"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testInvalidInputException() throws Exception {
        mockMvc.perform(get("/test-only/invalidInput"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid input provided"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testConsignmentServiceException() throws Exception {
        mockMvc.perform(get("/test-only/consignmentService"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Consignment service exception occurred"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testCooldownException() throws Exception {
        mockMvc.perform(get("/test-only/cooldown"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Cooldown exception occurred"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testAuthorizationException() throws Exception {
        mockMvc.perform(get("/test-only/authorization"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Authorization failed"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testIllegalStateException() throws Exception {
        mockMvc.perform(get("/test-only/illegalState"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Illegal state detected"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testIllegalArgumentException() throws Exception {
        mockMvc.perform(get("/test-only/illegalArgument"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Illegal argument provided"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    //@Test
    public void testJwtException() throws Exception {
        mockMvc.perform(get("/test-only/jwt"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("JWT token exception"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testOAuth2AuthenticationProcessingException() throws Exception {
        mockMvc.perform(get("/test-only/oauth2"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("OAuth2 authentication exception"))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}

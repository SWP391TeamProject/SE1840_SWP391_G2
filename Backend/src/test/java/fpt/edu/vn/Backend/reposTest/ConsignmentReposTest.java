package fpt.edu.vn.Backend.reposTest;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
public class ConsignmentReposTest {

    @Autowired
    private ConsignmentRepos consignmentRepos;

    @Test
    @Transactional
    public void testFindByUserID() {
        int userId = 51; // replace with the actual user ID you want to test
        Page<Consignment> consignments = consignmentRepos.findByUserID(userId, PageRequest.of(0, 10));
        assertFalse(consignments.isEmpty(), "The list of consignments should not be empty");
        assertEquals(userId, consignments.getContent().get(0).getConsignmentDetails().get(0).getAccount().getAccountId(), "The user ID should match");
    }
}
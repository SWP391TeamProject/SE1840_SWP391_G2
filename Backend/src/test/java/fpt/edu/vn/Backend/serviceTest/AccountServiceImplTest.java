package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.PasswordEncoderConfig;
import fpt.edu.vn.Backend.service.AccountServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AccountServiceImplTest {

    @Mock
    private AccountRepos accountRepos;

    @Mock
    private PasswordEncoderConfig passwordEncoderConfig;

    @InjectMocks
    private AccountServiceImpl accountService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should return all accounts when getAccounts is called")
    public void shouldReturnAllAccountsWhenGetAccountsIsCalled() {
        Account account1 = new Account();
        account1.setAccountId(1);
        account1.setNickname("test1");
        account1.setEmail("test1@test.com");

        Account account2 = new Account();
        account2.setAccountId(2);
        account2.setNickname("test2");
        account2.setEmail("test2@test.com");

        account1.setRole(Account.Role.MEMBER);
        account2.setRole(Account.Role.MEMBER);

        Page<Account> accounts = new PageImpl<>(Arrays.asList(account1, account2));

        when(accountRepos.findAll(PageRequest.of(0, 2))).thenReturn(accounts);

        Page<AccountDTO> result = accountService.getAccounts(PageRequest.of(0, 2));

        assertEquals(2, result.getContent().size());
    }

    @Test
    @DisplayName("Should return empty page when no accounts exist")
    public void shouldReturnEmptyPageWhenNoAccountsExist() {
        Page<Account> accounts = Page.empty();

        when(accountRepos.findAll(PageRequest.of(0, 2))).thenReturn(accounts);

        Page<AccountDTO> result = accountService.getAccounts(PageRequest.of(0, 2));

        assertEquals(0, result.getContent().size());
    }

    @Test
    @DisplayName("Should return all accounts by given role when getAccountsByRoleIds is called")
    public void shouldReturnAllAccountsByGivenRoleWhenGetAccountsByRoleIdsIsCalled() {
        var account1 = new Account();
        account1.setAccountId(1);
        account1.setNickname("test1");
        account1.setEmail("test1@test.com");

        var account2 = new Account();
        account2.setAccountId(2);
        account2.setNickname("test2");
        account2.setEmail("test2@test.com");

        account1.setRole(Account.Role.ADMIN);
        account2.setRole(Account.Role.MANAGER);

        var pr = PageRequest.of(0, 2);

        when(accountRepos.findByRoleIn(
                Set.of(Account.Role.ADMIN),
                pr
        )).thenReturn(new PageImpl<>(List.of(account1)));

        when(accountRepos.findByRoleIn(
                Set.of(Account.Role.MANAGER),
                pr
        )).thenReturn(new PageImpl<>(List.of(account2)));

        assertEquals(1, accountService.getAccountsByRoles(pr, Set.of(Account.Role.ADMIN)).getContent().size());
        assertEquals(1, accountService.getAccountsByRoles(pr, Set.of(Account.Role.MANAGER) ).getContent().size());
        assertEquals(0, accountService.getAccountsByRoles(pr, Set.of(Account.Role.ADMIN, Account.Role.MANAGER)).getContent().size());
    }

    @Test
    @DisplayName("Should create account successfully when valid account details are provided")
    public void shouldCreateAccountSuccessfullyWhenValidAccountDetailsAreProvided() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setNickname("test");
        accountDTO.setEmail("test@test.com");
        accountDTO.setPhone("1234567890");
        accountDTO.setBalance(BigDecimal.valueOf(1000.0));
        accountDTO.setCreateDate(LocalDateTime.now());
        accountDTO.setUpdateDate(LocalDateTime.now());
        accountDTO.setRole(Account.Role.ADMIN);
        accountDTO.setPassword("123456");

        Account account = new Account();
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setRole(Account.Role.ADMIN);

        when(accountRepos.save(any())).thenReturn(account);
        when(passwordEncoderConfig.bcryptEncoder()).thenReturn(new BCryptPasswordEncoder(10));

        AccountDTO result = accountService.createAccount(accountDTO);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should update account successfully when valid account details are provided")
    public void shouldUpdateAccountSuccessfullyWhenValidAccountDetailsAreProvided() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountId(1);
        accountDTO.setNickname("test");
        accountDTO.setEmail("test@test.com");
        accountDTO.setPhone("1234567890");
        accountDTO.setBalance(BigDecimal.valueOf(1000.0));
        accountDTO.setCreateDate(LocalDateTime.now());
        accountDTO.setUpdateDate(LocalDateTime.now());
        accountDTO.setRole(Account.Role.MEMBER);

        Account account = new Account();
        account.setAccountId(accountDTO.getAccountId());
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setRole(Account.Role.MEMBER);

        when(accountRepos.findById(accountDTO.getAccountId())).thenReturn(Optional.of(account));
        when(accountRepos.save(any())).thenReturn(account);

        AccountDTO result = accountService.updateAccount(accountDTO, Account.Role.ADMIN);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when invalid accountId is provided")
    public void shouldThrowResourceNotFoundExceptionWhenInvalidAccountIdIsProvided() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountId(999);
        accountDTO.setNickname("test");
        accountDTO.setEmail("test@test.com");
        accountDTO.setPhone("1234567890");
        accountDTO.setBalance(BigDecimal.valueOf(1000.0));
        accountDTO.setCreateDate(LocalDateTime.now());
        accountDTO.setUpdateDate(LocalDateTime.now());

        when(accountRepos.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.updateAccount(accountDTO, Account.Role.ADMIN));
    }

    @Test
    @DisplayName("Should return account when valid email is provided")
    public void shouldReturnAccountWhenValidEmailIsProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setRole(Account.Role.MEMBER);
        when(accountRepos.findByEmail("test@test.com")).thenReturn(Optional.of(account));

        AccountDTO result = accountService.getAccountByEmail("test@test.com");

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should return null when getting account with unknown email")
    public void shouldReturnNullWhenGettingAccountWithUnknownEmail() {
        when(accountRepos.findByEmail("invalid@test.com")).thenReturn(Optional.empty());
        assertNull(accountService.getAccountByEmail("invalid@test.com"));
    }
}
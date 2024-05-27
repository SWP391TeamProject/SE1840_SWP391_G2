package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.RoleRepos;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

public class AccountServiceImplTest {

    @Mock
    private AccountRepos accountRepos;

    @Mock
    private RoleRepos roleRepos;

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

        Set<Role> roles = Set.of(new Role());
        account1.setAuthorities(roles);
        account2.setAuthorities(roles);

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

        var role1 = new Role();
        role1.setRoleId(1);

        var role2 = new Role();
        role1.setRoleId(2);

        account1.setAuthorities(Set.of(role1));
        account2.setAuthorities(Set.of(role2));

        var pr = PageRequest.of(0, 2);

        when(accountRepos.findAccountByAuthoritiesRoleIds(
                Set.of(1),
                pr
        )).thenReturn(new PageImpl<>(List.of(account1)));

        when(accountRepos.findAccountByAuthoritiesRoleIds(
                Set.of(2),
                pr
        )).thenReturn(new PageImpl<>(List.of(account2)));

        assertEquals(1, accountService.getAccountsByRoleIds(pr, Set.of(1)).getContent().size());
        assertEquals(1, accountService.getAccountsByRoleIds(pr, Set.of(2)).getContent().size());
        assertEquals(0, accountService.getAccountsByRoleIds(pr, Set.of(1, 2)).getContent().size());
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
        accountDTO.setRole(Arrays.asList(1, 2));

        Account account = new Account();
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setAuthorities(accountDTO.getRole().stream().map(roleId -> new Role()).collect(Collectors.toSet()));

        when(accountRepos.save(any())).thenReturn(account);
        when(roleRepos.findById(anyInt())).thenReturn(Optional.of(new Role()));

        AccountDTO result = accountService.createAccount(accountDTO);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when invalid roleId is provided")
    public void shouldThrowResourceNotFoundExceptionWhenInvalidRoleIdIsProvided() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setNickname("test");
        accountDTO.setEmail("test@test.com");
        accountDTO.setPhone("1234567890");
        accountDTO.setBalance(BigDecimal.valueOf(1000.0));
        accountDTO.setCreateDate(LocalDateTime.now());
        accountDTO.setUpdateDate(LocalDateTime.now());
        accountDTO.setRole(List.of(999));

        when(roleRepos.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.createAccount(accountDTO));
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
        accountDTO.setRole(Arrays.asList(1, 2));

        Account account = new Account();
        account.setAccountId(accountDTO.getAccountId());
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setAuthorities(accountDTO.getRole().stream().map(roleId -> new Role()).collect(Collectors.toSet()));

        when(accountRepos.findById(accountDTO.getAccountId())).thenReturn(Optional.of(account));
        when(accountRepos.save(any())).thenReturn(account);
        when(roleRepos.findById(anyInt())).thenReturn(Optional.of(new Role()));

        AccountDTO result = accountService.updateAccount(accountDTO);

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
        accountDTO.setRole(Arrays.asList(1, 2));

        when(accountRepos.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.updateAccount(accountDTO));
    }

    @Test
    @DisplayName("Should return account when valid email is provided")
    public void shouldReturnAccountWhenValidEmailIsProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setAuthorities(new HashSet<>());

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

    @Test
    @DisplayName("Should return account when valid email and password are provided")
    public void shouldReturnAccountWhenValidEmailAndPasswordAreProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setPassword("password");
        account.setAuthorities(new HashSet<>());

        when(accountRepos.findByEmailAndPassword("test@test.com", "password")).thenReturn(Optional.of(account));

        AccountDTO result = accountService.getAccountByEmailAndPassword("test@test.com", "password");

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when invalid email or password are provided")
    public void shouldThrowResourceNotFoundExceptionWhenInvalidEmailOrPasswordAreProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setPassword("password");

        when(accountRepos.findByEmailAndPassword("test@test.com", "password")).thenReturn(Optional.of(account));

        assertNull(accountService.getAccountByEmailAndPassword("invalid@test.com", "password"));
        assertNull(accountService.getAccountByEmailAndPassword("test@test.com", "invalid"));
    }

    @Test
    @DisplayName("Should activate account")
    public void shouldActivateAccount() {
        Account account = new Account();
        account.setAccountId(1);
        account.setStatus((byte) 0);
        account.setEmail("test@test.com");
        account.setPassword("password");

        when(accountRepos.findById(1)).thenReturn(Optional.of(account));
        when(accountRepos.save(account)).thenReturn(account);

        accountService.activateAccount(1);

        assertEquals((byte) 1, account.getStatus());
    }

    @Test
    @DisplayName("Should deactivate account")
    public void shouldDeactivateAccount() {
        Account account = new Account();
        account.setAccountId(1);
        account.setStatus((byte) 1);
        account.setEmail("test@test.com");
        account.setPassword("password");

        when(accountRepos.findById(1)).thenReturn(Optional.of(account));
        when(accountRepos.save(account)).thenReturn(account);

        accountService.deactivateAccount(1);

        assertEquals((byte) 0, account.getStatus());
    }
}
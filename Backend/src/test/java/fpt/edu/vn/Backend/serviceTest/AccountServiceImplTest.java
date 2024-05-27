package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.RoleDTO;
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

import static org.mockito.ArgumentMatchers.any;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import java.util.stream.Collectors;
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
    @DisplayName("Should return all accounts when getAllAccounts is called")
    public void shouldReturnAllAccountsWhenGetAllAccountsIsCalled() {
        Account account1 = new Account();
        account1.setAccountId(1);
        account1.setNickname("test1");
        account1.setEmail("test1@test.com");

        Account account2 = new Account();
        account2.setAccountId(2);
        account2.setNickname("test2");
        account2.setEmail("test2@test.com");

        Set<Role> roles = new HashSet<>();
        roles.add(new Role());
        account1.setAuthorities(roles);
        account2.setAuthorities(roles);

        Page<Account> accounts = new PageImpl<>(Arrays.asList(account1, account2));

        when(accountRepos.findAll(PageRequest.of(0, 2))).thenReturn(accounts);

        Page<AccountDTO> result = accountService.getAllAccounts(PageRequest.of(0, 2));

        assertEquals(2, result.getContent().size());
    }

    @Test
    @DisplayName("Should return empty page when no accounts exist")
    public void shouldReturnEmptyPageWhenNoAccountsExist() {
        Page<Account> accounts = Page.empty();

        when(accountRepos.findAll(PageRequest.of(0, 2))).thenReturn(accounts);

        Page<AccountDTO> result = accountService.getAllAccounts(PageRequest.of(0, 2));

        assertEquals(0, result.getContent().size());
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
        accountDTO.setRole(Arrays.asList(new RoleDTO(1,"MEMBER"),new RoleDTO(2,"STAFF")));

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
        accountDTO.setRole(Arrays.asList(new RoleDTO(9,"")));

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
        accountDTO.setRole(Arrays.asList(new RoleDTO(1,"MEMBER"),new RoleDTO(2,"STAFF")));

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
        accountDTO.setRole(Arrays.asList(new RoleDTO(1,"MEMBER"),new RoleDTO(2,"STAFF")));

        when(accountRepos.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.updateAccount(accountDTO));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when invalid roleId is provided")
    public void shouldThrowResourceNotFoundExceptionWhenInvalidRoleIdIsProvidedInUpdate() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountId(1);
        accountDTO.setNickname("test");
        accountDTO.setEmail("test@test.com");
        accountDTO.setPhone("1234567890");
        accountDTO.setBalance(BigDecimal.valueOf(1000.0));
        accountDTO.setCreateDate(LocalDateTime.now());
        accountDTO.setUpdateDate(LocalDateTime.now());
        accountDTO.setRole(Arrays.asList(new RoleDTO(999,"")));

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
        when(roleRepos.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.updateAccount(accountDTO));
    }

    @Test
    @DisplayName("Should return account when valid email is provided")
    public void shouldReturnAccountWhenValidEmailIsProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setAuthorities(new HashSet<>()); // Initialize authorities

        when(accountRepos.findAll()).thenReturn(Collections.singletonList(account));

        AccountDTO result = accountService.getAccountByEmail("test@test.com");

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when invalid email is provided")
    public void shouldThrowResourceNotFoundExceptionWhenInvalidEmailIsProvided() {
        when(accountRepos.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountByEmail("invalid@test.com"));
    }

    @Test
    @DisplayName("Should return account when valid email and password are provided")
    public void shouldReturnAccountWhenValidEmailAndPasswordAreProvided() {
        Account account = new Account();
        account.setEmail("test@test.com");
        account.setPassword("password");
        account.setAuthorities(new HashSet<>()); // Initialize authorities

        when(accountRepos.findAll()).thenReturn(Collections.singletonList(account));

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

        when(accountRepos.findAll()).thenReturn(Collections.singletonList(account));

        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountByEmailAndPassword("invalid@test.com", "password"));
        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountByEmailAndPassword("test@test.com", "invalid"));
    }

}
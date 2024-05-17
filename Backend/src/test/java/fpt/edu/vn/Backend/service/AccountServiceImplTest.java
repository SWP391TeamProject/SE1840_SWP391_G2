package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

public class AccountServiceImplTest {

    private AccountServiceImpl accountService;
    private Account account;

    @BeforeEach
    public void setup() {
        accountService = Mockito.mock(AccountServiceImpl.class);
        account = new Account();
        account.setPassword("test");
        account.setEmail("test@test.com");
    }

    @Test
    @DisplayName("Should return all accounts")
    public void shouldReturnAllAccounts() {
        when(accountService.getAllAccounts()).thenReturn(List.of(account));
        assertEquals(1, accountService.getAllAccounts().size());
    }

    @Test
    @DisplayName("Should create account")
    public void shouldCreateAccount() {
        when(accountService.createAccount(account)).thenReturn(account);
        assertEquals(account, accountService.createAccount(account));
    }

    @Test
    @DisplayName("Should return account by id")
    public void shouldReturnAccountById() {
        when(accountService.getAccountById(1)).thenReturn(account);
        assertEquals(account, accountService.getAccountById(1));
    }

    @Test
    @DisplayName("Should update account")
    public void shouldUpdateAccount() {
        when(accountService.updateAccount(account)).thenReturn(account);
        assertEquals(account, accountService.updateAccount(account));
    }

    @Test
    @DisplayName("Should return account by username")
    public void shouldReturnAccountByUsername() {
        when(accountService.getAccountByUsername("test")).thenReturn(account);
        assertEquals(account, accountService.getAccountByUsername("test"));
    }

    @Test
    @DisplayName("Should return account by username and password")
    public void shouldReturnAccountByUsernameAndPassword() {
        when(accountService.getAccountByUsernameAndPassword("test", "test")).thenReturn(account);
        assertEquals(account, accountService.getAccountByUsernameAndPassword("test", "test"));
    }

    @Test
    @DisplayName("Should return account by email and password")
    public void shouldReturnAccountByEmailAndPassword() {
        when(accountService.getAccountByEmailAndPassword("test@test.com")).thenReturn(account);
        assertEquals(account, accountService.getAccountByEmailAndPassword("test@test.com"));
    }

    @Test
    @DisplayName("Should delete account")
    public void shouldDeleteAccount() {
        accountService.deleteAccount(1);
        when(accountService.getAccountById(1)).thenReturn(null);
        assertNull(accountService.getAccountById(1));
    }
}
package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;

import java.util.List;

public class AccountServiceImpl implements AccountService{
    @Override
    public List<Account> getAllAccounts() {
        return List.of();
    }

    @Override
    public Account createAccount(Account account) {
        return null;
    }

    @Override
    public Account getAccountById(int id) {
        return null;
    }

    @Override
    public Account updateAccount(Account account) {
        return null;
    }

    @Override
    public void deleteAccount(int id) {

    }

    @Override
    public Account getAccountByUsername(String username) {
        return null;
    }

    @Override
    public Account getAccountByUsernameAndPassword(String username, String password) {
        return null;
    }

    @Override
    public Account getAccountByEmailAndPassword(String email) {
        return null;
    }
}

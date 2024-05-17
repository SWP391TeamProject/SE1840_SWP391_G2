package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;

import java.util.Comparator;
import java.util.List;

public class AuthServiceImpl implements AuthService{
    private final AccountRepos accountRepos;

    public AuthServiceImpl(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    public String login(String username, String password) {
        return "";
    }

    @Override
    public String register(String username, String password, String email) {
        return "";
    }

    @Override
    public String logout(String token) {
        return "";
    }

    @Override
    public String refreshToken(String token) {
        return "";
    }

    @Override
    public String forgotPassword(String email) {
        return "";
    }

    @Override
    public String loginWithGoogle(String token) {
        return "";
    }

    @Override
    public String loginWithFacebook(String token) {
        return "";
    }
}

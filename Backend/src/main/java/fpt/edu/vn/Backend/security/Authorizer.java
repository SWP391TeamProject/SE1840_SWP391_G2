package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.exception.AuthorizationException;
import fpt.edu.vn.Backend.pojo.Account;
import io.jsonwebtoken.Jwt;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.security.Principal;
import java.util.EnumSet;
import java.util.Set;

public class Authorizer {
    public static final Set<Account.Role> ADMIN = EnumSet.of(Account.Role.ADMIN);
    public static final Set<Account.Role> MANAGER = EnumSet.of(Account.Role.ADMIN, Account.Role.MANAGER);
    public static final Set<Account.Role> STAFF = EnumSet.of(Account.Role.ADMIN, Account.Role.MANAGER, Account.Role.STAFF);

    @NotNull
    public static JwtUser requireUser(@Nullable Principal principal) {
        JwtUser user = Authorizer.getUser(principal);
        if (user == null)
            throw new AuthorizationException("Authentication is required");
        return user;
    }

    @Nullable
    public static JwtUser getUser(@Nullable Principal principal) {
        if (principal == null)
            return null; 
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        Object idObject = token.getTokenAttributes().get("userId");
        int id = idObject instanceof Integer ? (int) idObject : Integer.parseInt(idObject.toString());
        String email = token.getName();
        Account.Role role = Account.Role.valueOf(token.getAuthorities().iterator().next().getAuthority());
        return new JwtUser(id, email, role);
    }

    @Nullable
    public static Integer getUserId(@Nullable Principal principal) {
        JwtUser user = Authorizer.getUser(principal);
        if (user == null)
            return null;
        return user.getUserId();
    }

    @NotNull
    public static JwtUser expectAdminOrUserId(@Nullable Principal principal, int expectUserId) {
        JwtUser user = Authorizer.requireUser(principal);
        if (ADMIN.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect admin or user id %d but got %d", expectUserId, user.getUserId()));
    }

    @NotNull
    public static JwtUser expectManagerOrUserId(@Nullable Principal principal, int expectUserId) {
        JwtUser user = Authorizer.requireUser(principal);
        if (MANAGER.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect manager or user id %d but got %d", expectUserId, user.getUserId()));
    }

    @NotNull
    public static JwtUser expectStaffOrUserId(@Nullable Principal principal, int expectUserId) {
        JwtUser user = Authorizer.requireUser(principal);
        if (STAFF.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect staff or user id %d but got %d", expectUserId, user.getUserId()));
    }

    @NotNull
    public static JwtUser expectAdminOrUserEmail(@Nullable Principal principal, String expectEmail) {
        JwtUser user = Authorizer.requireUser(principal);
        if (ADMIN.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect admin or email %s but got %s", expectEmail, user.getEmail()));
    }

    @NotNull
    public static JwtUser expectManagerOrUserEmail(@Nullable Principal principal, String expectEmail) {
        JwtUser user = Authorizer.requireUser(principal);
        if (MANAGER.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect manager or email %s but got %s", expectEmail, user.getEmail()));
    }

    @NotNull
    public static JwtUser expectStaffOrUserEmail(@Nullable Principal principal, String expectEmail) {
        JwtUser user = Authorizer.requireUser(principal);
        if (STAFF.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect staff or email %s but got %s", expectEmail, user.getEmail()));
    }
}

package fpt.edu.vn.Backend.security;

import fpt.edu.vn.Backend.exception.AuthorizationException;
import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.security.Principal;
import java.util.EnumSet;
import java.util.Set;

public class Authorizer {
    public static final Set<Account.Role> ADMIN = EnumSet.of(Account.Role.ADMIN);
    public static final Set<Account.Role> MANAGER = EnumSet.of(Account.Role.ADMIN, Account.Role.MANAGER);
    public static final Set<Account.Role> STAFF = EnumSet.of(Account.Role.ADMIN, Account.Role.MANAGER, Account.Role.STAFF);

    public static JwtUser getUser(Principal principal) {
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        Object idObject = token.getTokenAttributes().get("userId");
        int id = idObject instanceof Integer ? (int) idObject : Integer.parseInt(idObject.toString());
        String email = token.getName();
        Account.Role role = Account.Role.valueOf(token.getAuthorities().iterator().next().getAuthority());
        return new JwtUser(id, email, role);
    }

    public static JwtUser expectAdminOrUserId(Principal principal, int expectUserId) {
        JwtUser user = Authorizer.getUser(principal);
        if (ADMIN.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect admin or user id %d but got %d", expectUserId, user.getUserId()));
    }

    public static JwtUser expectManagerOrUserId(Principal principal, int expectUserId) {
        JwtUser user = Authorizer.getUser(principal);
        if (MANAGER.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect manager or user id %d but got %d", expectUserId, user.getUserId()));
    }

    public static JwtUser expectStaffOrUserId(Principal principal, int expectUserId) {
        JwtUser user = Authorizer.getUser(principal);
        if (STAFF.contains(user.getRole()) || user.getUserId() == expectUserId)
            return user;
        throw new AuthorizationException(String.format("Expect staff or user id %d but got %d", expectUserId, user.getUserId()));
    }

    public static JwtUser expectAdminOrUserEmail(Principal principal, String expectEmail) {
        JwtUser user = Authorizer.getUser(principal);
        if (ADMIN.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect admin or email %s but got %s", expectEmail, user.getEmail()));
    }

    public static JwtUser expectManagerOrUserEmail(Principal principal, String expectEmail) {
        JwtUser user = Authorizer.getUser(principal);
        if (MANAGER.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect manager or email %s but got %s", expectEmail, user.getEmail()));
    }

    public static JwtUser expectStaffOrUserEmail(Principal principal, String expectEmail) {
        JwtUser user = Authorizer.getUser(principal);
        if (STAFF.contains(user.getRole()) || user.getEmail().equals(expectEmail))
            return user;
        throw new AuthorizationException(String.format("Expect staff or email %s but got %s", expectEmail, user.getEmail()));
    }
}

package fpt.edu.vn.Backend.oauth2.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class UserActivityService {

    // In-memory map to track user activity
    private final Map<String, Long> userLastActivity = new ConcurrentHashMap<>();

    // Update the last activity timestamp for a user
    public void updateUserActivity(String userId) {
        userLastActivity.put(userId, System.currentTimeMillis());
    }
    public void removeUserActivity(String userId) {
        userLastActivity.remove(userId);
    }

    // Retrieve users who were active within a specified time threshold
    public Map<String, Long> getOnlineUsers(long thresholdMillis) {
        long now = System.currentTimeMillis();
        return userLastActivity.entrySet().stream()
                .filter(entry -> now - entry.getValue() <= thresholdMillis)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}

package fpt.edu.vn.Backend.security;

import org.springframework.context.event.EventListener;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.session.HttpSessionCreatedEvent;
import org.springframework.stereotype.Component;

@Component
public class SessionEventListener {
    private final SessionRegistry sessionRegistry;

    public SessionEventListener(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    @EventListener
    public void onApplicationEvent(SessionDestroyedEvent event) {
        sessionRegistry.removeSessionInformation(event.getId());
    }

    @EventListener
    public void onHttpSessionCreated(HttpSessionCreatedEvent event) {
        sessionRegistry.registerNewSession(event.getSession().getId(), event.getSession().getAttribute("SPRING_SECURITY_CONTEXT"));
    }
}

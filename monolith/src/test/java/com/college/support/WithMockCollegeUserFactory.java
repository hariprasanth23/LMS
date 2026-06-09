package com.college.support;

import com.college.auth.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.time.LocalDateTime;
import java.util.UUID;

public class WithMockCollegeUserFactory
        implements WithSecurityContextFactory<WithMockCollegeUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCollegeUser annotation) {
        User principal = User.builder()
                .id(UUID.randomUUID())
                .name(annotation.name())
                .email(annotation.email())
                .password("$2a$10$encoded-for-test")
                .role(User.Role.valueOf(annotation.role()))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        principal, null, principal.getAuthorities());

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(auth);
        return ctx;
    }
}

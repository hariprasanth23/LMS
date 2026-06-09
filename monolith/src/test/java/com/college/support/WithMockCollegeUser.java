package com.college.support;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Injects a {@code com.college.auth.model.User} (our custom UserDetails) into
 * the SecurityContext so that {@code @AuthenticationPrincipal User} method
 * parameters resolve correctly in @WebMvcTest controller tests.
 *
 * <p>Usage: {@code @WithMockCollegeUser(role = "ADMIN")}
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockCollegeUserFactory.class)
public @interface WithMockCollegeUser {

    String email() default "test@college.com";
    String name()  default "Test User";
    String role()  default "STUDENT";
}

package com.lms.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * End-to-end happy-path: registers a user, logs in, hits {@code /me}, then
 * fails on a deliberately weak password to verify the validation regex.
 *
 * <p>Spring boots against a real Postgres in a Testcontainers-managed Docker
 * container. No mocks of the repository, encoder, or JWT util — this is the
 * smoke test that proves the wiring works end-to-end before we trust CI.
 *
 * <p>Disables the internal HMAC filter so the test doesn't have to sign every
 * request the way the gateway would.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
class AuthFlowSmokeTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        // long, alphanumeric so JwtUtil + InternalAuthFilter both accept it
        r.add("app.jwt.secret",      () -> "ci-test-jwt-secret-at-least-32-characters-long");
        r.add("app.internal.secret", () -> "ci-test-internal-hmac-secret-at-least-32-chars");
        r.add("app.internal.enforce", () -> "false");          // skip HMAC inside tests
        r.add("spring.data.redis.repositories.enabled", () -> "false");
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void register_then_login_then_me() throws Exception {
        // 1. Register
        String regBody = """
            {"name":"Smoke Test","email":"smoke@example.com","password":"GoodPwd1!"}
            """;
        MvcResult reg = mvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON).content(regBody))
                .andReturn();
        assertThat(reg.getResponse().getStatus()).isEqualTo(201);

        JsonNode regNode = json.readTree(reg.getResponse().getContentAsString());
        assertThat(regNode.get("success").asBoolean()).isTrue();
        assertThat(regNode.get("data").get("accessToken").asText()).isNotBlank();

        // 2. Login
        String loginBody = """
            {"identifier":"smoke@example.com","password":"GoodPwd1!"}
            """;
        MvcResult login = mvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON).content(loginBody))
                .andReturn();
        assertThat(login.getResponse().getStatus()).isEqualTo(200);
        String setCookie = login.getResponse().getHeader("Set-Cookie");
        assertThat(setCookie).isNotNull().contains("lms_token=").contains("HttpOnly");

        JsonNode loginNode = json.readTree(login.getResponse().getContentAsString());
        String userId = loginNode.get("data").get("user").get("id").asText();

        // 3. GET /me with X-User-Id header (gateway would inject this normally)
        MvcResult me = mvc.perform(get("/api/auth/me").header("X-User-Id", userId))
                .andReturn();
        assertThat(me.getResponse().getStatus()).isEqualTo(200);
        JsonNode meNode = json.readTree(me.getResponse().getContentAsString());
        assertThat(meNode.get("data").get("email").asText()).isEqualTo("smoke@example.com");
        assertThat(meNode.get("data").get("role").asText()).isEqualTo("STUDENT");
    }

    @Test
    void weak_password_rejected_with_code() throws Exception {
        String body = """
            {"name":"Weak User","email":"weak@example.com","password":"weakweak"}
            """;
        MvcResult res = mvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON).content(body))
                .andReturn();
        assertThat(res.getResponse().getStatus()).isEqualTo(400);

        JsonNode node = json.readTree(res.getResponse().getContentAsString());
        assertThat(node.get("success").asBoolean()).isFalse();
        assertThat(node.get("code").asText()).isEqualTo("AUTH_PASSWORD_WEAK");
    }
}

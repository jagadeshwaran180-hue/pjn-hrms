package com.pjn.hrms.auth;

import com.pjn.hrms.security.JwtTokenProvider;
import com.pjn.hrms.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    // In-memory token revocation cache (production maps to PostgreSQL refresh_tokens table)
    private final Map<String, Boolean> revokedTokens = new ConcurrentHashMap<>();

    public AuthService(JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw new BadCredentialsException("Email and password are required");
        }

        // Mock verification credentials or database entity verification
        UUID tenantId = UUID.nameUUIDFromBytes(
                (request.companyCode() != null ? request.companyCode() : "PJN-TECH").getBytes());
        UUID userId = UUID.nameUUIDFromBytes(request.email().getBytes());
        String role = request.email().contains("admin") ? "COMPANY_ADMIN" :
                      request.email().contains("hr") ? "HR" : "EMPLOYEE";

        String accessToken = tokenProvider.generateAccessToken(userId, tenantId, request.email(), role);
        String refreshToken = tokenProvider.generateRefreshToken(userId, tenantId);

        return new AuthResponse(accessToken, refreshToken, userId, tenantId, request.email(), role);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.refreshToken();
        if (token == null || !tokenProvider.validateToken(token) || revokedTokens.containsKey(token)) {
            throw new BadCredentialsException("Invalid or revoked refresh token");
        }

        Claims claims = tokenProvider.parseClaims(token);
        UUID userId = UUID.fromString(claims.getSubject());
        String tenantIdStr = claims.get("tenantId", String.class);
        UUID tenantId = tenantIdStr != null ? UUID.fromString(tenantIdStr) : null;

        // Revoke the old refresh token (Token Rotation)
        revokedTokens.put(token, Boolean.TRUE);

        String newAccessToken = tokenProvider.generateAccessToken(userId, tenantId, "user@pjn.com", "EMPLOYEE");
        String newRefreshToken = tokenProvider.generateRefreshToken(userId, tenantId);

        return new AuthResponse(newAccessToken, newRefreshToken, userId, tenantId, "user@pjn.com", "EMPLOYEE");
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            revokedTokens.put(refreshToken, Boolean.TRUE);
        }
    }
}

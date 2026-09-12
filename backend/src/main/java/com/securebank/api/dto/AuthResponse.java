package com.securebank.api.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private long expiresInMs;
    private String username;
    private String fullName;

    public AuthResponse(String token, long expiresInMs, String username, String fullName) {
        this.token = token;
        this.expiresInMs = expiresInMs;
        this.username = username;
        this.fullName = fullName;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(long expiresInMs) { this.expiresInMs = expiresInMs; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}

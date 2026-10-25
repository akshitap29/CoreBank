
package com.corebank.dto;

public class LoginResponse {

    private String token;
    private Long userId;
    private String name;

    public LoginResponse(String token, Long userId, String name) {
        this.token = token;
        this.userId = userId;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }
}

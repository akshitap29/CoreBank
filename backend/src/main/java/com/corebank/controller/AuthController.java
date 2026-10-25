
package com.corebank.controller;

import org.springframework.web.bind.annotation.RestController;
import com.corebank.service.UserService;

import com.corebank.dto.RegisterRequest;
import com.corebank.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.corebank.dto.UserResponse;

import com.corebank.dto.LoginRequest;
import com.corebank.dto.LoginResponse;
import com.corebank.service.JwtService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/api/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword());

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail());
    }

    @PostMapping("/api/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getName()
        );
    }


}

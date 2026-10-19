package org.neurohearts.neuropathways.controller;

import org.neurohearts.neuropathways.dto.UserResponse;
import org.neurohearts.neuropathways.entity.User;
import org.neurohearts.neuropathways.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal Jwt jwt
    ) {

        Long userId =
                Long.valueOf(
                        jwt.getSubject()
                );

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow();

        return ResponseEntity.ok(
                new UserResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail()
                )
        );
    }
}
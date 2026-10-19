package org.neurohearts.neuropathways.service;


import org.neurohearts.neuropathways.dto.LoginRequest;
import org.neurohearts.neuropathways.dto.LoginResponse;
import org.neurohearts.neuropathways.dto.RegisterRequest;
import org.neurohearts.neuropathways.dto.UserResponse;
import org.neurohearts.neuropathways.entity.User;
import org.neurohearts.neuropathways.exception.EmailAlreadyExistsException;
import org.neurohearts.neuropathways.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("An account already exists for this email.");
        }

        User user = new User();

        user.setFirstName(request.getFirstName().trim());

        user.setLastName(request.getLastName().trim());

        user.setEmail(email);

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser.getId(), savedUser.getFirstName(), savedUser.getLastName(), savedUser.getEmail());
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        String token =
                jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }

}
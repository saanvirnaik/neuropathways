package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.entity.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    @Value("${app.jwt.expiration-minutes}")
    private long expirationMinutes;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(User user) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder().issuer("neuropathways").issuedAt(now).expiresAt(now.plus(expirationMinutes, ChronoUnit.MINUTES))

                // user ID becomes the JWT subject
                .subject(user.getId().toString())

                .claim("email", user.getEmail())

                .claim("firstName", user.getFirstName())

                .claim("lastName", user.getLastName())

                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
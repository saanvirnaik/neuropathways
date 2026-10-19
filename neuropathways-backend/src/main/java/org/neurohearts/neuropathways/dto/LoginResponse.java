package org.neurohearts.neuropathways.dto;

public class LoginResponse {

    private final String token;
    private final Long userId;
    private final String firstName;
    private final String lastName;
    private final String email;

    public LoginResponse(String token, Long userId, String firstName, String lastName, String email) {
        this.token = token;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }
}
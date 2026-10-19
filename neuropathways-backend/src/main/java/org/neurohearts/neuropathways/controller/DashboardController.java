package org.neurohearts.neuropathways.controller;

import org.neurohearts.neuropathways.dto.DashboardResponse;
import org.neurohearts.neuropathways.service.DashboardService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/me")
    public DashboardResponse getDashboard(
            @AuthenticationPrincipal Jwt jwt
    ) {

        Long userId =
                Long.valueOf(jwt.getSubject());

        return dashboardService
                .getDashboard(userId);
    }
}
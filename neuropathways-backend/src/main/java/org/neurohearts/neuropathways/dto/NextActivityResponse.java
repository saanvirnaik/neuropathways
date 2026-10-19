package org.neurohearts.neuropathways.dto;

public class NextActivityResponse {

    private Long id;
    private String title;
    private String skill;
    private Integer estimatedMinutes;

    public NextActivityResponse() {
    }

    public NextActivityResponse(
            Long id,
            String title,
            String skill,
            Integer estimatedMinutes
    ) {
        this.id = id;
        this.title = title;
        this.skill = skill;
        this.estimatedMinutes = estimatedMinutes;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSkill() {
        return skill;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }
}
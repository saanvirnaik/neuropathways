package org.neurohearts.neuropathways.dto;

public class SkillProgressResponse {

    private String skill;
    private Integer mastery;
    private String status;

    public SkillProgressResponse() {
    }

    public SkillProgressResponse(
            String skill,
            Integer mastery,
            String status
    ) {
        this.skill = skill;
        this.mastery = mastery;
        this.status = status;
    }

    public String getSkill() {
        return skill;
    }

    public Integer getMastery() {
        return mastery;
    }

    public String getStatus() {
        return status;
    }
}
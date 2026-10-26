package org.neurohearts.neuropathways.dto;

import org.neurohearts.neuropathways.entity.ReadingSkill;

public record StartPracticeRequest(
        ReadingSkill skill
) {}
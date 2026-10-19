package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "learner_preferences",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_learner_preferences_user",
                        columnNames = "user_id"
                )
        }
)
public class LearnerPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            optional = false,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(nullable = false)
    private Integer fontSize = 18;

    @Column(nullable = false)
    private String fontFamily = "DEFAULT";

    @Column(nullable = false)
    private String backgroundTheme = "DEFAULT";

    @Column(nullable = false)
    private Boolean textToSpeech = false;

    @Column(nullable = false)
    private Boolean focusMode = false;

    @Column(nullable = false)
    private Boolean readingGuide = false;

    @Column(nullable = false)
    private Boolean increasedSpacing = false;

    @Column(nullable = false)
    private Boolean flexiblePace = true;

    public LearnerPreference() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getFontSize() {
        return fontSize;
    }

    public void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
    }

    public String getFontFamily() {
        return fontFamily;
    }

    public void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
    }

    public String getBackgroundTheme() {
        return backgroundTheme;
    }

    public void setBackgroundTheme(String backgroundTheme) {
        this.backgroundTheme = backgroundTheme;
    }

    public Boolean getTextToSpeech() {
        return textToSpeech;
    }

    public void setTextToSpeech(Boolean textToSpeech) {
        this.textToSpeech = textToSpeech;
    }

    public Boolean getFocusMode() {
        return focusMode;
    }

    public void setFocusMode(Boolean focusMode) {
        this.focusMode = focusMode;
    }

    public Boolean getReadingGuide() {
        return readingGuide;
    }

    public void setReadingGuide(Boolean readingGuide) {
        this.readingGuide = readingGuide;
    }

    public Boolean getIncreasedSpacing() {
        return increasedSpacing;
    }

    public void setIncreasedSpacing(Boolean increasedSpacing) {
        this.increasedSpacing = increasedSpacing;
    }

    public Boolean getFlexiblePace() {
        return flexiblePace;
    }

    public void setFlexiblePace(Boolean flexiblePace) {
        this.flexiblePace = flexiblePace;
    }
}
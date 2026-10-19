package org.neurohearts.neuropathways.dto;

public class LearnerPreferenceResponse {

    private Integer fontSize;
    private String fontFamily;
    private String backgroundTheme;
    private Boolean textToSpeech;
    private Boolean focusMode;
    private Boolean readingGuide;
    private Boolean increasedSpacing;
    private Boolean flexiblePace;

    public LearnerPreferenceResponse() {
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
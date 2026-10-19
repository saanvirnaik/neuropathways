import type {LearnerPreferences} from "../services/preferenceService.ts";

type Props = {
    preferences: LearnerPreferences;
    saving: boolean;
    onChange: (
        preferences: LearnerPreferences
    ) => void;
};

function ReadingPreferences({
                                preferences,
                                saving,
                                onChange
                            }: Props) {
    const update = (
        changes: Partial<LearnerPreferences>
    ) => {
        onChange({
            ...preferences,
            ...changes
        });
    };

    return (
        <section className="reading-settings-card">
            <div className="reading-settings-header">
                <div>
          <span className="eyebrow">
            MY READING SETTINGS
          </span>

                    <h2>
                        Make Reading Work for You
                    </h2>

                    <p>
                        These settings follow you across
                        NeuroPathways.
                    </p>
                </div>

                <div className="preference-save-state">
                    {saving
                        ? "Saving..."
                        : "✓ Saved"}
                </div>
            </div>

            <div className="reading-settings-grid">

                <div className="reading-setting">
          <span className="setting-icon">
            Aa
          </span>

                    <div>
                        <strong>
                            Text Size
                        </strong>

                        <small>
                            Adjust how large text appears
                        </small>
                    </div>

                    <div className="font-size-controls">
                        <button
                            type="button"
                            onClick={() =>
                                update({
                                    fontSize: Math.max(
                                        14,
                                        preferences.fontSize - 2
                                    )
                                })
                            }
                        >
                            A−
                        </button>

                        <span>
              {preferences.fontSize}
            </span>

                        <button
                            type="button"
                            onClick={() =>
                                update({
                                    fontSize: Math.min(
                                        30,
                                        preferences.fontSize + 2
                                    )
                                })
                            }
                        >
                            A+
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className={
                        preferences.fontFamily === "READABLE"
                            ? "reading-setting toggle active"
                            : "reading-setting toggle"
                    }
                    onClick={() =>
                        update({
                            fontFamily:
                                preferences.fontFamily === "READABLE"
                                    ? "DEFAULT"
                                    : "READABLE"
                        })
                    }
                >
          <span className="setting-icon">
            A
          </span>

                    <span>
            <strong>
              Readable Font
            </strong>

            <small>
              Use an easier-to-read font
            </small>
          </span>

                    <span className="setting-check">
            {preferences.fontFamily === "READABLE"
                ? "✓"
                : ""}
          </span>
                </button>

                <button
                    type="button"
                    className={
                        preferences.backgroundTheme === "SOFT"
                            ? "reading-setting toggle active"
                            : "reading-setting toggle"
                    }
                    onClick={() =>
                        update({
                            backgroundTheme:
                                preferences.backgroundTheme === "SOFT"
                                    ? "DEFAULT"
                                    : "SOFT"
                        })
                    }
                >
          <span className="setting-icon">
            ◐
          </span>

                    <span>
            <strong>
              Soft Background
            </strong>

            <small>
              Reduce visual strain
            </small>
          </span>

                    <span className="setting-check">
            {preferences.backgroundTheme === "SOFT"
                ? "✓"
                : ""}
          </span>
                </button>

                <PreferenceToggle
                    icon="🔊"
                    title="Text to Speech"
                    description="Listen while you read"
                    active={preferences.textToSpeech}
                    onClick={() =>
                        update({
                            textToSpeech:
                                !preferences.textToSpeech
                        })
                    }
                />

                <PreferenceToggle
                    icon="◉"
                    title="Focus Mode"
                    description="Reduce distractions"
                    active={preferences.focusMode}
                    onClick={() =>
                        update({
                            focusMode:
                                !preferences.focusMode
                        })
                    }
                />

                <PreferenceToggle
                    icon="📏"
                    title="Reading Guide"
                    description="Highlight the current line"
                    active={preferences.readingGuide}
                    onClick={() =>
                        update({
                            readingGuide:
                                !preferences.readingGuide
                        })
                    }
                />

                <PreferenceToggle
                    icon="↔"
                    title="More Spacing"
                    description="Increase word and line spacing"
                    active={preferences.increasedSpacing}
                    onClick={() =>
                        update({
                            increasedSpacing:
                                !preferences.increasedSpacing
                        })
                    }
                />

                <PreferenceToggle
                    icon="Ⅱ"
                    title="Flexible Pace"
                    description="Learn without time pressure"
                    active={preferences.flexiblePace}
                    onClick={() =>
                        update({
                            flexiblePace:
                                !preferences.flexiblePace
                        })
                    }
                />
            </div>
        </section>
    );
}

type ToggleProps = {
    icon: string;
    title: string;
    description: string;
    active: boolean;
    onClick: () => void;
};

function PreferenceToggle({
                              icon,
                              title,
                              description,
                              active,
                              onClick
                          }: ToggleProps) {
    return (
        <button
            type="button"
            className={
                active
                    ? "reading-setting toggle active"
                    : "reading-setting toggle"
            }
            onClick={onClick}
        >
      <span className="setting-icon">
        {icon}
      </span>

            <span>
        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>
      </span>

            <span className="setting-check">
        {active ? "✓" : ""}
      </span>
        </button>
    );
}

export default ReadingPreferences;
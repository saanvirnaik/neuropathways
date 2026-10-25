
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/contact.css";
import { submitContactMessage } from "../services/api";

type ContactTopic =
    | "general"
    | "accessibility"
    | "privacy"
    | "technical"
    | "feedback";

type ContactForm = {
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
};

type SubmissionState =
    | "idle"
    | "submitting"
    | "success"
    | "error";

const initialForm: ContactForm = {
    name: "",
    email: "",
    topic: "general",
    message: ""
};

const contactOptions = [
    {
        icon: "💬",
        title: "General Questions",
        description:
            "Questions about NeuroPathways and how it works."
    },
    {
        icon: "♿",
        title: "Accessibility Support",
        description:
            "Tell us about barriers or difficulties using the site."
    },
    {
        icon: "🛡️",
        title: "Privacy Concerns",
        description:
            "Ask about personal information and family privacy."
    },
    {
        icon: "💡",
        title: "Ideas & Feedback",
        description:
            "Share suggestions to improve the learning experience."
    }
];

function Contact() {
    const [form, setForm] =
        useState<ContactForm>(initialForm);

    const [status, setStatus] =
        useState<SubmissionState>("idle");

    const [errorMessage, setErrorMessage] =
        useState("");

    const updateField = <K extends keyof ContactForm>(
        field: K,
        value: ContactForm[K]
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));

        if (status !== "submitting") {
            setStatus("idle");
            setErrorMessage("");
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (status === "submitting") return;

        setStatus("submitting");
        setErrorMessage("");

        try {
            await submitContactMessage({
                name: form.name.trim(),
                email: form.email.trim(),
                topic: form.topic,
                message: form.message.trim()
            });

            setStatus("success");
            setForm(initialForm);

        } catch {
            setStatus("error");
            setErrorMessage(
                "We couldn't send your message. Please try again later."
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="contact-page">

                {/* Hero */}
                <section className="contact-hero">
                    <div className="contact-container">
                        <span className="contact-eyebrow">
                            CONTACT NEUROPATHWAYS
                        </span>

                        <h1>We're Here to Help</h1>

                        <p>
                            Have a question, suggestion,
                            or concern? We welcome feedback
                            from learners, families,
                            and educators.
                        </p>

                        <strong>
                            Every question matters.
                            Every voice deserves to be heard.
                        </strong>
                    </div>
                </section>

                {/* Contact categories */}
                <section className="contact-section">
                    <div className="contact-container">
                        <div className="contact-heading">
                            <span>HOW CAN WE HELP?</span>
                            <h2>Let's Find the Right Support</h2>
                            <p>
                                Whether you're exploring
                                NeuroPathways or already using
                                the platform, we're here
                                to listen.
                            </p>
                        </div>

                        <div className="contact-options-grid">
                            {contactOptions.map((option) => (
                                <article
                                    className="contact-option-card"
                                    key={option.title}
                                >
                                    <div
                                        className="contact-option-icon"
                                        aria-hidden="true"
                                    >
                                        {option.icon}
                                    </div>

                                    <h3>{option.title}</h3>
                                    <p>{option.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact form */}
                <section className="contact-section contact-tinted">
                    <div className="contact-container">
                        <div className="contact-form-layout">

                            <div className="contact-form-intro">
                                <span className="contact-eyebrow">
                                    SEND A MESSAGE
                                </span>

                                <h2>We'd Love to Hear from You</h2>

                                <p>
                                    Use this form for general
                                    questions, accessibility
                                    feedback, privacy inquiries,
                                    or suggestions.
                                </p>

                                <div className="contact-help-card">
                                    <span aria-hidden="true">💜</span>

                                    <h3>A Note for Young Learners</h3>

                                    <p>
                                        If you're a child and
                                        need help, please ask
                                        a parent, guardian,
                                        or trusted adult to
                                        contact us with you.
                                    </p>
                                </div>

                                <div className="contact-help-card">
                                    <span aria-hidden="true">🔒</span>

                                    <h3>Protecting Personal Information</h3>

                                    <p>
                                        Please do not include
                                        a child's full name,
                                        diagnosis, reading scores,
                                        passwords, or other
                                        sensitive information.
                                    </p>
                                </div>
                            </div>

                            <div className="contact-form-card">
                                <h3>Send Us a Message</h3>

                                <p className="contact-form-description">
                                    Fields marked * are required.
                                </p>

                                <form onSubmit={handleSubmit}>

                                    <div className="contact-field">
                                        <label htmlFor="contact-name">
                                            Your Name *
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={form.name}
                                            onChange={(event) =>
                                                updateField(
                                                    "name",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your name"
                                            autoComplete="name"
                                            maxLength={100}
                                            required
                                        />
                                    </div>

                                    <div className="contact-field">
                                        <label htmlFor="contact-email">
                                            Email Address *
                                        </label>

                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={form.email}
                                            onChange={(event) =>
                                                updateField(
                                                    "email",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            maxLength={254}
                                            required
                                        />
                                    </div>

                                    <div className="contact-field">
                                        <label htmlFor="contact-topic">
                                            How Can We Help? *
                                        </label>

                                        <select
                                            id="contact-topic"
                                            value={form.topic}
                                            onChange={(event) =>
                                                updateField(
                                                    "topic",
                                                    event.target.value as ContactTopic
                                                )
                                            }
                                            required
                                        >
                                            <option value="general">
                                                General Question
                                            </option>
                                            <option value="accessibility">
                                                Accessibility Support
                                            </option>
                                            <option value="privacy">
                                                Privacy Concern
                                            </option>
                                            <option value="technical">
                                                Technical Support
                                            </option>
                                            <option value="feedback">
                                                Feedback or Suggestion
                                            </option>
                                        </select>
                                    </div>

                                    <div className="contact-field">
                                        <label htmlFor="contact-message">
                                            Your Message *
                                        </label>

                                        <textarea
                                            id="contact-message"
                                            rows={6}
                                            value={form.message}
                                            onChange={(event) =>
                                                updateField(
                                                    "message",
                                                    event.target.value
                                                )
                                            }
                                            placeholder={
                                                "Tell us how we can help. " +
                                                "Please avoid sharing " +
                                                "sensitive student information."
                                            }
                                            minLength={10}
                                            maxLength={2000}
                                            required
                                        />

                                        <span className="contact-character-count">
                                            {form.message.length}/2000
                                        </span>
                                    </div>

                                    <div className="contact-privacy-note">
                                        <span aria-hidden="true">🛡️</span>

                                        <p>
                                            Please avoid sharing
                                            sensitive student information.
                                            Learn more in our{" "}
                                            <Link to="/privacy">
                                                Privacy Policy
                                            </Link>.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="contact-submit-button"
                                        disabled={status === "submitting"}
                                    >
                                        {status === "submitting"
                                            ? "Sending..."
                                            : "Send Message"}

                                        <span aria-hidden="true"> →</span>
                                    </button>

                                    {status === "success" && (
                                        <p
                                            className="contact-success"
                                            role="status"
                                        >
                                            Thank you! Your message
                                            has been submitted.
                                        </p>
                                    )}

                                    {status === "error" && (
                                        <p
                                            className="contact-error"
                                            role="alert"
                                        >
                                            {errorMessage}
                                        </p>
                                    )}

                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional guidance */}
                <section className="contact-section">
                    <div className="contact-container">
                        <div className="contact-guidance">
                            <h2>Looking for Learning Support?</h2>

                            <p>
                                Explore our educational resources
                                and accessibility information
                                for helpful reading strategies
                                and learning guidance.
                            </p>

                            <div className="contact-guidance-links">
                                <Link to="/resources">
                                    Learning Resources →
                                </Link>

                                <Link to="/accessibility">
                                    Accessibility Information →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Contact;


import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/privacy.css";

type PrivacyPromise = {
    icon: string;
    title: string;
    description: string;
};

const privacyPromises: PrivacyPromise[] = [
    {
        icon: "🔒",
        title: "Your Learning Is Personal",
        description:
            "Your reading progress is personal information. " +
            "You do not need to share your results with other students."
    },
    {
        icon: "💜",
        title: "Everyone Learns Differently",
        description:
            "Your reading results do not measure how smart, " +
            "capable, or valuable you are."
    },
    {
        icon: "🤝",
        title: "You Can Ask for Help",
        description:
            "If you have questions about your information, " +
            "talk to a parent, guardian, or trusted adult."
    },
    {
        icon: "💬",
        title: "Your Voice Matters",
        description:
            "If something makes you uncomfortable, " +
            "tell a trusted adult or contact our team."
    }
];

function Privacy() {
    return (
        <>
            <Navbar />

            <main className="privacy-page">

                {/* Hero */}
                <section className="privacy-hero">
                    <div className="privacy-container">
                        <span className="privacy-eyebrow">
                            PRIVACY AT NEUROPATHWAYS
                        </span>

                        <h1>Your Learning. Your Privacy.</h1>

                        <p>
                            We believe every learner deserves
                            a respectful and supportive learning
                            environment where personal information
                            is treated with care.
                        </p>

                        <strong>
                            Learning with confidence,
                            privacy, and respect.
                        </strong>
                    </div>
                </section>

                {/* Child-friendly privacy promise */}
                <section className="privacy-section">
                    <div className="privacy-container">
                        <div className="privacy-heading">
                            <span>FOR OUR YOUNG LEARNERS</span>
                            <h2>Our Privacy Promise</h2>
                            <p>
                                Here are a few things we want
                                every learner to understand.
                            </p>
                        </div>

                        <div className="privacy-promise-grid">
                            {privacyPromises.map((item) => (
                                <article
                                    className="privacy-promise-card"
                                    key={item.title}
                                >
                                    <div
                                        className="privacy-card-icon"
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </div>

                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed privacy policy */}
                <section
                    className="privacy-section privacy-tinted"
                    id="privacy-policy"
                >
                    <div className="privacy-container">
                        <div className="privacy-heading">
                            <span>FOR FAMILIES AND GUARDIANS</span>
                            <h2>Privacy Policy</h2>
                            <p>
                                How NeuroPathways intends to
                                handle personal information
                                and support family privacy.
                            </p>
                        </div>

                        <div className="privacy-document">
                            <p className="privacy-updated">
                                Last updated: [INSERT DATE]
                            </p>

                            <div className="privacy-notice">
                                <strong>
                                    Policy under development
                                </strong>
                                <p>
                                    This draft describes intended
                                    privacy practices. Details
                                    marked for confirmation must
                                    be finalized before collecting
                                    personal information from users.
                                </p>
                            </div>

                            <h3>1. Our Commitment</h3>
                            <p>
                                NeuroPathways is designed to
                                support reading development
                                through educational activities,
                                personalized practice, and
                                accessibility options.
                            </p>
                            <p>
                                We recognize that information
                                about a child's learning
                                experience can be personal.
                                Our goal is to collect only
                                information necessary to
                                provide educational services
                                and handle it responsibly.
                            </p>

                            <h3>2. Who Can Use NeuroPathways</h3>
                            <p>
                                NeuroPathways is intended for
                                learners, parents, guardians,
                                and educators.
                            </p>
                            <p>
                                For children under 13, collecting
                                personal information may require
                                verifiable parental consent
                                under applicable law.
                            </p>
                            <p className="privacy-pending">
                                To confirm before launch:
                                age eligibility, account creation,
                                and parent/guardian consent process.
                            </p>

                            <h3>3. Information We Collect</h3>
                            <p>
                                Depending on the features enabled,
                                NeuroPathways may process:
                            </p>

                            <ul>
                                <li>
                                    Account information, such as
                                    usernames or contact details.
                                </li>
                                <li>
                                    Reading activity responses,
                                    skill levels, and progress.
                                </li>
                                <li>
                                    Accessibility preferences,
                                    when saved.
                                </li>
                                <li>
                                    Technical information needed
                                    to operate and secure the service.
                                </li>
                            </ul>

                            <p>
                                We recommend avoiding the
                                collection of medical diagnoses
                                or disability information unless
                                genuinely necessary.
                            </p>

                            <p className="privacy-pending">
                                To confirm before launch:
                                exact database fields, cookies,
                                logs, analytics, and third-party
                                data collection.
                            </p>

                            <h3>4. How Information Is Used</h3>
                            <p>
                                Information may be used to
                                provide learning activities,
                                personalize practice, save
                                progress, maintain accounts,
                                and respond to support requests.
                            </p>
                            <p>
                                Any additional uses, including
                                analytics, research, or AI-based
                                processing, must be disclosed
                                before implementation.
                            </p>

                            <h3>5. Sharing Information</h3>
                            <p>
                                NeuroPathways aims to limit
                                information sharing to what
                                is necessary to operate
                                the platform.
                            </p>
                            <p>
                                The final policy must identify
                                the categories of service
                                providers that receive
                                personal information.
                            </p>
                            <p className="privacy-pending">
                                To confirm before launch:
                                hosting providers, authentication,
                                email services, analytics,
                                AI integrations, and advertising
                                or data-sharing practices.
                            </p>

                            <h3>6. Protecting Information</h3>
                            <p>
                                Student information deserves
                                appropriate safeguards.
                                NeuroPathways aims to use
                                security practices suitable
                                for the information processed.
                            </p>
                            <p>
                                No online service can guarantee
                                absolute security.
                            </p>
                            <p className="privacy-pending">
                                To confirm before launch:
                                encryption, access controls,
                                password handling, backups,
                                and incident-response procedures.
                            </p>

                            <h3>7. Data Retention and Deletion</h3>
                            <p>
                                Personal information should
                                not be kept longer than
                                reasonably necessary for
                                its disclosed purposes,
                                subject to legal requirements.
                            </p>
                            <p className="privacy-pending">
                                To confirm before launch:
                                retention periods, deletion
                                procedures, and backup handling.
                            </p>

                            <h3>8. Cookies and External Services</h3>
                            <p>
                                The final policy will describe
                                any cookies, browser storage,
                                analytics, and third-party
                                integrations used by
                                NeuroPathways.
                            </p>

                            <h3>9. Policy Updates</h3>
                            <p>
                                As NeuroPathways develops,
                                this policy may change.
                                Updates will be reflected
                                in the revision date, with
                                additional notice or consent
                                when required.
                            </p>

                            <h3>10. Privacy Questions</h3>
                            <p>
                                Parents and guardians can
                                contact the NeuroPathways
                                team with questions about
                                privacy practices and
                                available data rights.
                            </p>

                            <Link
                                to="/contact"
                                className="privacy-text-link"
                            >
                                Contact NeuroPathways →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Family rights */}
                <section
                    className="privacy-section"
                    id="family-rights"
                >
                    <div className="privacy-container">
                        <div className="privacy-family-panel">
                            <div
                                className="privacy-family-icon"
                                aria-hidden="true"
                            >
                                👨‍👩‍👧
                            </div>

                            <div>
                                <span className="privacy-eyebrow">
                                    CHILDREN'S PRIVACY
                                </span>

                                <h2>
                                    Supporting Parents
                                    and Guardians
                                </h2>

                                <p>
                                    Families should understand
                                    what information is collected
                                    about their children and
                                    how it is used.
                                </p>

                                <p>
                                    Where applicable, privacy
                                    rights may include reviewing
                                    personal information,
                                    requesting corrections
                                    or deletion, and withdrawing
                                    consent for future collection.
                                </p>

                                <p>
                                    The availability and process
                                    for these requests depend
                                    on applicable law and
                                    the platform's implemented
                                    account controls.
                                </p>

                                <Link
                                    to="/contact"
                                    className="privacy-primary-link"
                                >
                                    Ask a Privacy Question
                                    <span aria-hidden="true"> →</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Educational disclaimer */}
                <section
                    className="privacy-section privacy-tinted"
                    id="educational-disclaimer"
                >
                    <div className="privacy-container">
                        <div className="privacy-heading">
                            <span>IMPORTANT INFORMATION</span>
                            <h2>
                                Educational & Assessment Disclaimer
                            </h2>
                            <p>
                                Understanding what NeuroPathways
                                can and cannot tell us about
                                a learner.
                            </p>
                        </div>

                        <div className="privacy-document">

                            <h3>Learning Support, Not a Diagnosis</h3>
                            <p>
                                NeuroPathways is an educational
                                platform designed to support
                                reading development through
                                learning activities, practice,
                                and accessibility options.
                            </p>
                            <p>
                                Assessments, skill levels,
                                learning pathways, and progress
                                indicators are intended to guide
                                educational practice.
                            </p>
                            <p>
                                They are not medical or
                                psychological evaluations
                                and should not be used to
                                diagnose dyslexia, ADHD,
                                or other learning conditions.
                            </p>

                            <h3>Every Learner Is Different</h3>
                            <p>
                                Reading abilities develop
                                in different ways and at
                                different rates.
                            </p>
                            <p>
                                Performance may be influenced
                                by familiarity with material,
                                attention, fatigue, language
                                experience, and other factors.
                            </p>
                            <p>
                                Assessment results reflect
                                performance on particular
                                activities at a particular time.
                                They do not measure intelligence,
                                personal worth, or overall potential.
                            </p>

                            <h3>Professional Guidance</h3>
                            <p>
                                NeuroPathways does not replace
                                individualized instruction,
                                formal educational evaluations,
                                or advice from qualified
                                educators and specialists.
                            </p>
                            <p>
                                Families concerned about
                                a child's reading development
                                should speak with a teacher,
                                reading specialist, or other
                                qualified professional.
                            </p>

                            <h3>Accessibility and Individual Needs</h3>
                            <p>
                                No single font, display setting,
                                reading strategy, or learning
                                pathway works best for everyone.
                            </p>
                            <p>
                                Accessibility options support
                                comfort and participation but
                                do not replace specialized
                                instruction when needed.
                            </p>

                            <h3>Supporting Confidence</h3>
                            <p>
                                NeuroPathways encourages
                                skill development, independence,
                                and confidence.
                            </p>
                            <p>
                                Learning differences should
                                be approached with understanding
                                and respect, never as labels
                                that define a child's potential.
                            </p>

                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="privacy-contact">
                    <div className="privacy-container">
                        <span className="privacy-eyebrow">
                            QUESTIONS OR CONCERNS?
                        </span>

                        <h2>We're Here to Help</h2>

                        <p>
                            If you have questions about
                            privacy, student information,
                            or the educational purpose
                            of NeuroPathways, please
                            contact our team.
                        </p>

                        <Link
                            to="/contact"
                            className="privacy-primary-link"
                        >
                            Contact Us
                            <span aria-hidden="true"> →</span>
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Privacy;

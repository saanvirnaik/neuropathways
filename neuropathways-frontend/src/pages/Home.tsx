// src/pages/Home.jsx

import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import JourneySteps from "../components/JourneySteps.tsx";
import Features from "../components/Features";
import AdaptiveTools from "../components/AdaptiveTools.tsx";
import Footer from "../components/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <JourneySteps />
                <Features />
                <AdaptiveTools />
            </main>
            <Footer />
        </>
    );
}

export default Home;
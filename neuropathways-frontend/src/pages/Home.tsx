// src/pages/Home.jsx

import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import JourneySteps from "../components/JourneySteps.tsx";
import AdaptiveTools from "../components/AdaptiveTools.tsx";
import Footer from "../components/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <JourneySteps />
                <AdaptiveTools />
            </main>
            <Footer />
        </>
    );
}

export default Home;
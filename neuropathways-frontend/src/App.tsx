import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/supportpages.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Assessment from "./pages/Assessment";
import AssessmentSession from "./pages/AssessmentSession";
import AssessmentResults from "./pages/AssessmentResults";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Accessibility from "./pages/Accessibility";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import ScrollToHash from "./components/ScrollToHash";
import Practice from "./pages/Practice";

function App() {
    return (
        <BrowserRouter>
            <ScrollToHash />
            <Routes>
                <Route
                    path="/assessment/session/:sessionId/results"
                    element={<AssessmentResults />}
                />
                {/* Public pages */}
                <Route path="/" element={<Home/>}/>

                <Route
                    path="/login"
                    element={<Login/>}
                />

                <Route
                    path="/signup"
                    element={<Signup/>}
                />


                {/* Assessment flow */}
                <Route
                    path="/assessment"
                    element={<Assessment/>}
                />

                <Route
                    path="/assessment/session/:sessionId"
                    element={<AssessmentSession/>}
                />


                {/* Learner pages */}
                <Route
                    path="/learning-path"
                    element={<LearningPath/>}
                />

                <Route path="/about" element={<About />} />

                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                />

                <Route path="/resources" element={<Resources />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/practice" element={<Practice />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import {BrowserRouter, Route, Routes} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Assessment from "./pages/Assessment";
import AssessmentSession from "./pages/AssessmentSession";
import AssessmentResults from "./pages/AssessmentResults";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/assessment/session/:sessionId/results" element={<AssessmentResults/>}/>
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

                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

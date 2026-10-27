import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { ReadingPreferencesProvider }
    from "./context/ReadingPreferencesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ReadingPreferencesProvider>
            <App />
        </ReadingPreferencesProvider>
    </React.StrictMode>
);
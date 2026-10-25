
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToHash() {
    const { pathname, hash } = useLocation();

    useEffect(() => {

        if (!hash) {
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });
            return;
        }

        const sectionId = decodeURIComponent(hash.slice(1));
        let observer: MutationObserver | null = null;

        const scrollToTarget = () => {
            const element = document.getElementById(sectionId);

            if (!element) return false;

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return true;
        };

        // Wait until the destination route renders its content.
        const frameId = requestAnimationFrame(() => {
            if (scrollToTarget()) return;

            // Handles sections that render after navigation.
            observer = new MutationObserver(() => {
                if (scrollToTarget()) {
                    observer?.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        return () => {
            cancelAnimationFrame(frameId);
            observer?.disconnect();
        };
    }, [pathname, hash]);

    return null;
}

export default ScrollToHash;

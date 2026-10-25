const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (import.meta.env.PROD && !configuredApiUrl) {
    throw new Error("VITE_API_BASE_URL must be configured for production builds.");
}
export const API_BASE_URL = (configuredApiUrl || "http://localhost:8080/api").replace(/\/$/, "");

export async function authenticatedFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("neuropathwaysToken");

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options, headers,
    });

    if (response.status === 401) {
        localStorage.removeItem("neuropathwaysToken");

        localStorage.removeItem("neuropathwaysUser");
    }

    return response;
}
export type ContactRequest = {
    name: string;
    email: string;
    topic: "general" | "accessibility" | "privacy" | "technical" | "feedback";
    message: string;
};

export async function submitContactMessage(
    contact: ContactRequest
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    });

    if (!response.ok) {
        throw new Error("Unable to submit contact message");
    }
}
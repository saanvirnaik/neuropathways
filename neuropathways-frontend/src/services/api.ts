export const API_BASE_URL = "http://localhost:8080/api";

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

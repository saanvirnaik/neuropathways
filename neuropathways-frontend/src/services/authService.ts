import {API_BASE_URL, authenticatedFetch} from "./api";

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
};

export function saveLoginSession(response: LoginResponse) {
    localStorage.setItem("neuropathwaysToken", response.token);
    localStorage.setItem("neuropathwaysUser", JSON.stringify({
        userId: response.userId, firstName: response.firstName,
        lastName: response.lastName, email: response.email,
    }));
    window.dispatchEvent(new Event("neuropathways-auth-changed"));
}

export async function registerUser(
    request: RegisterRequest
): Promise<RegisterResponse> {

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(request),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to create account."
        );
    }

    return data;
}

export async function loginUser(
    request: LoginRequest
): Promise<LoginResponse> {

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to log in."
        );
    }

    return data;
}

export async function getCurrentUser() {

    const response =
        await authenticatedFetch(
            "/users/me"
        );

    if (!response.ok) {
        throw new Error(
            "Unable to load user profile."
        );
    }

    return response.json();
}

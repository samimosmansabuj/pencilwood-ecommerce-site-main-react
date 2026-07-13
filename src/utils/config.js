export const API_BASE = import.meta.env.VITE_API_BASE || "https://apitest.pencilwoodbd.org";

export function getAccessToken() {
    return localStorage.getItem("access") || localStorage.getItem("token") || "";
}

export function getRefreshToken() {
    return localStorage.getItem("refresh") || "";
}

export function isLoggedIn() {
    return !!getAccessToken();
}

export function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAccessToken()}`
    };
}

export async function logoutUser() {
    try {
        const refresh = getRefreshToken();
        if (refresh) {
            await fetch(`${API_BASE}/api/auth/logout/`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ refresh })
            });
        }
    } catch (err) {
        console.error("Logout Error:", err);
    }

    /* CLEAR STORAGE */
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

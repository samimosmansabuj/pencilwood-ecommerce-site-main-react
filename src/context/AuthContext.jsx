import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE, getAccessToken, isLoggedIn, logoutUser } from "../utils/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

    useEffect(() => {
        setIsAuthenticated(isLoggedIn());
    }, []);

    const saveTokens = (data) => {
        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
        if (data.token) localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.status) {
                saveTokens(data);
                return true;
            }
            return false;
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            return false;
        }
    };

    const signup = async (payload) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && data.status) {
                saveTokens(data);
                return true;
            }
            return false;
        } catch (err) {
            console.error("SIGNUP ERROR:", err);
            return false;
        }
    };

    const logout = async () => {
        await logoutUser();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

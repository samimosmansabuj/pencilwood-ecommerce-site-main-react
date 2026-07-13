import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toastMessage, setToastMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const toast = useCallback((msg) => {
        setToastMessage(msg);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            setTimeout(() => {
                setToastMessage(null);
            }, 300);
        }, 2500);
    }, []);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {toastMessage && (
                <div id="toast-container">
                    <div className={`toast ${showToast ? "show" : ""}`}>
                        {toastMessage}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

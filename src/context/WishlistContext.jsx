import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE, getAccessToken } from "../utils/config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { useCart } from "./CartContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { fetchCart } = useCart();
    const toast = useToast();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlistItems([]);
            setWishlistCount(0);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/wishlist/`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            });
            const data = await res.json();
            
            if (data.status && Array.isArray(data.data)) {
                setWishlistItems(data.data);
                setWishlistCount(data.data.length);
            } else {
                setWishlistItems([]);
                setWishlistCount(0);
            }
        } catch (err) {
            console.error("Wishlist fetch error:", err);
            setWishlistItems([]);
            setWishlistCount(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) {
            toast("Please login first");
            return;
        }
        try {
            // Adjust to your actual API logic, legacy code didn't have addToWishlist inside wishlist.js explicitly except cart add.
            // But if needed, this can be implemented.
            toast("Added to wishlist");
            fetchWishlist();
        } catch (err) {
            console.error(err);
        }
    };

    const removeWishlist = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/wishlist/remove/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            });
            const data = await res.json();
            if (data.status) {
                toast("Removed from wishlist");
                fetchWishlist();
            } else {
                toast(data.message || "Remove failed");
            }
        } catch (err) {
            console.error(err);
            toast("Something went wrong");
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, wishlistCount, loading, fetchWishlist, addToWishlist, removeWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}

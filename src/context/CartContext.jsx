import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE, getAccessToken } from "../utils/config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Guest cart helper
    const getGuestCart = () => {
        try {
            return JSON.parse(localStorage.getItem('guest_cart')) || [];
        } catch {
            return [];
        }
    };

    const saveGuestCart = (cart) => {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
    };

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            const guestCart = getGuestCart();
            setCartItems(guestCart);
            setCartCount(guestCart.reduce((sum, item) => sum + (item.quantity || 0), 0));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/cart/`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            });
            const data = await res.json();
            
            const items = data?.data || data?.results || data?.cart_items || [];
            setCartItems(items);
            
            const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(total);
        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Sync guest cart upon login
    useEffect(() => {
        async function syncGuestCart() {
            if (isAuthenticated) {
                const guestCart = getGuestCart();
                if (guestCart.length > 0) {
                    for (const item of guestCart) {
                        try {
                            // Add item to backend
                            await fetch(`${API_BASE}/cart/add/`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${getAccessToken()}`
                                },
                                body: JSON.stringify({ product_id: item.product_id || item.product?.id || item.id, quantity: item.quantity })
                            });
                        } catch (err) {
                            console.error("Failed to sync item", item, err);
                        }
                    }
                    // Clear guest cart after syncing
                    localStorage.removeItem('guest_cart');
                }
                fetchCart();
            } else {
                fetchCart();
            }
        }
        syncGuestCart();
    }, [isAuthenticated, fetchCart]);

    const quickAddCart = async (productId, productData = null) => {
        if (!isAuthenticated) {
            // Guest Cart Logic
            let guestCart = getGuestCart();
            const existingItem = guestCart.find(i => i.product?.id === productId || i.product_id === productId || i.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                // If productData is provided, we store it. If not, we just store the ID (might not render nicely, but quickAddCart usually has access to basic info).
                guestCart.push({ 
                    id: productId, // dummy cart ID
                    product_id: productId, 
                    quantity: 1,
                    product: productData || { id: productId, name: "Product " + productId, price: 0 } // fallback
                });
            }
            saveGuestCart(guestCart);
            toast("Added to guest cart 🛒");
            fetchCart();
            return;
        }

        // Authenticated Logic
        try {
            const res = await fetch(`${API_BASE}/cart/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });
            const data = await res.json();
            if (data.status || data.success) {
                toast("Added to cart 🛒");
                fetchCart();
            } else {
                toast(data.message || "Failed to add cart");
            }
        } catch (err) {
            console.error(err);
            toast("Something went wrong");
        }
    };

    const changeQty = async (cartId, quantity) => {
        if (quantity < 1) return;
        
        if (!isAuthenticated) {
            let guestCart = getGuestCart();
            const item = guestCart.find(i => i.id === cartId || i.product_id === cartId);
            if (item) {
                item.quantity = quantity;
                saveGuestCart(guestCart);
                fetchCart();
            }
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/cart/update/${cartId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({ quantity })
            });
            const data = await res.json();
            if (data.status) fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeCartItem = async (cartId) => {
        if (!isAuthenticated) {
            let guestCart = getGuestCart();
            guestCart = guestCart.filter(i => i.id !== cartId && i.product_id !== cartId);
            saveGuestCart(guestCart);
            fetchCart();
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/cart/remove/${cartId}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            });
            const data = await res.json();
            if (data.status) fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, cartCount, loading, fetchCart, quickAddCart, changeQty, removeCartItem }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

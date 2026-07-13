import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import App from './App.jsx'

import './styles/home.css'
import './styles/products.css'
import './styles/product.css'
import './styles/cart.css'
import './styles/checkout.css'
import './styles/auth.css'
import './styles/profile.css'
import './styles/address.css'
import './styles/orders.css'
import './styles/wishlist.css'
import './styles/order.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)

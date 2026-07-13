import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../utils/config';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { quickAddCart } = useCart();

  const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const image = product.image ? (product.image.startsWith("http") ? product.image : API_BASE + product.image) : "";

  const handleOpenProduct = () => {
    navigate(`/product/${slug}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    quickAddCart(product.id);
  };

  return (
    <div className="prod-card">
      <div className="prod-img" onClick={handleOpenProduct}>
        <img src={image} alt={product.name} />
      </div>

      <div className="prod-name" onClick={handleOpenProduct}>
        {product.name}
      </div>

      <div className="prod-price">
        ৳ {product.discount_price || product.price}
      </div>

      <button className="prod-cart" onClick={handleQuickAdd}>
        + Cart
      </button>
    </div>
  );
}

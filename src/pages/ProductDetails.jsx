import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { quickAddCart } = useCart();
  const { addToWishlist } = useWishlist();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/ecom/products/${slug}/`);
        const data = await res.json();
        
        let p = null;
        if (data?.data) p = data.data;
        else p = data;

        if (!p) {
          setError("Product not found");
          return;
        }

        setProduct(p);

        let image = "";
        if (p.images && Array.isArray(p.images) && p.images.length > 0) {
          image = p.images[0];
        } else if (p.image) {
          image = p.image;
        }

        if (image && !image.startsWith("http")) {
          image = API_BASE + image;
        }
        setMainImage(image);

        // Fetch related products (using same API, taking a few)
        const relRes = await fetch(`${API_BASE}/api/ecom/products/`);
        const relData = await relRes.json();
        let allProds = relData?.results?.data || relData?.data || relData || [];
        if (Array.isArray(allProds)) {
          setRelatedProducts(allProds.filter(rp => rp.id !== p.id).slice(0, 4));
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      loadProductDetails();
    }
  }, [slug]);

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error || !product) return <p style={{ padding: '20px', color: 'red' }}>{error || "Product not found"}</p>;

  // Data processing
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(img => img.startsWith("http") ? img : API_BASE + img)
    : (product.image ? [product.image.startsWith("http") ? product.image : API_BASE + product.image] : []);

  const price = Number(product.price || 0);
  const discountPrice = Number(product.discount_price || 0);
  const finalPrice = discountPrice || price;
  const stock = parseInt(product.stock ?? 0, 10);
  const sku = product.sku || "";
  
  const handleBuyNow = () => {
    quickAddCart(product.id);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard");
    }
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Shop', link: '/products' },
        { label: product.name }
      ]} />

      <div className="prod-hero">
        <div className="prod-hero-inner">
          
          <div className="gal-col">
            <div className="gal-main" id="galMain">
              <div className="gal-top-badges">
                {product.is_new && <span className="p-badge new">New</span>}
                {discountPrice > 0 && <span className="p-badge hot">Sale</span>}
              </div>
              <div className="gal-top-right">
                <div className="g-act" onClick={() => addToWishlist(product.id)} title="Wishlist">♡</div>
                <div className="g-act" onClick={handleShare} title="Share">🔗</div>
              </div>
              <img id="productImage" src={mainImage || "https://placehold.co/600x600?text=No+Image"} alt={product.name} />
            </div>

            {images.length > 1 && (
              <div className="thumbs" id="thumbGrid">
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumb ${mainImage === img ? 'active' : ''}`} 
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`Thumb ${i+1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-col">
            <div className="brand-row">
              <span className="brand-lnk">Pencilwood</span>
              <span className="v-badge">✔ Verified</span>
              {sku && <span className="sku-lbl">SKU: {sku}</span>}
            </div>

            <div>
              <div className="prod-title">{product.name}</div>
              <div className="prod-bn bn" dangerouslySetInnerHTML={{ __html: product.short_description || product.description?.substring(0, 100) || "" }} />
            </div>

            <div className="stars-row">
              <div className="stars">★★★★☆</div>
              <span className="r-score">4.8</span>
              <span className="r-cnt">{product.review_count || 500} ratings</span>
              <div className="r-sep"></div>
              <span className="r-sold">{product.sold_count || 1000} sold</span>
              <span className="stock-chip">{stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </div>

            <div className="price-box">
              <div className="price-row">
                <span className="price-main">৳ {finalPrice}</span>
                {discountPrice > 0 && <span className="price-orig">৳ {price}</span>}
                {discountPrice > 0 && (
                  <span className="price-disc">
                    -{Math.round(((price - discountPrice) / price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="qty-row-wrap">
              <span className="qty-note">Only {stock} left</span>
            </div>

            <div>
              <div className="btn-group" style={{ marginBottom: '7px' }}>
                <button className="btn-buy" onClick={handleBuyNow}>🛒 Buy Now</button>
                <button className="btn-cart" onClick={() => quickAddCart(product.id)}>+ Add to Cart</button>
              </div>
              <div className="btn-sec-row">
                <button className="btn-wish" onClick={() => addToWishlist(product.id)}>♡ Wishlist</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="lp-section">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 'desc' ? 'on' : ''}`} onClick={() => setActiveTab('desc')}>Description</button>
          <button className={`tab-btn ${activeTab === 'feat' ? 'on' : ''}`} onClick={() => setActiveTab('feat')}>Features & Specs</button>
          <button className={`tab-btn ${activeTab === 'reviews' ? 'on' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
          <button className={`tab-btn ${activeTab === 'faq' ? 'on' : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
        </div>

        {activeTab === 'desc' && (
          <div className="tab-pane on">
            <h3 className="pane-title">Product Description</h3>
            <div className="pane-content bn" dangerouslySetInnerHTML={{ __html: product.description || "No description provided." }} />
          </div>
        )}
        
        {activeTab === 'feat' && (
          <div className="tab-pane on">
            <h3 className="pane-title">Features & Specifications</h3>
            <div className="pane-content bn" dangerouslySetInnerHTML={{ __html: product.features || product.specification || "No specifications provided." }} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-pane on">
            <h3 className="pane-title">Customer Reviews</h3>
            <div className="pane-content">No reviews yet.</div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="tab-pane on">
            <h3 className="pane-title">Frequently Asked Questions</h3>
            <div className="pane-content">
              <strong>Q: How long does delivery take?</strong><br />
              A: 1-2 days inside Dhaka, 3-5 days outside.
            </div>
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="lp-section">
          <div className="lp-head">
            <div className="lp-title">You May Also Like</div>
          </div>
          <div className="products-grid">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

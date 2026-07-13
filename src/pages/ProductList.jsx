import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE } from '../utils/config';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // 10 for Product List page based on main.js

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let apiUrl = `${API_BASE}/api/ecom/products/`;
        const queryParams = new URLSearchParams(searchParams);
        if (queryParams.toString()) {
          apiUrl += `?${queryParams.toString()}`;
        }
        
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        let loadedProducts = [];
        if (data?.results?.data) loadedProducts = data.results.data;
        else if (data?.data) loadedProducts = data.data;
        else if (Array.isArray(data)) loadedProducts = data;
        
        setProducts(loadedProducts);
        
        const cats = new Set();
        loadedProducts.forEach(p => {
          let cat = typeof p.category === 'object' ? (p.category?.name || '') : (p.category || '');
          if (cat) cats.add(cat);
        });
        setCategories(Array.from(cats));

      } catch (err) {
        console.error("LOAD PRODUCTS ERROR:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (categoryFilter !== 'all') {
      data = data.filter(p => {
        let productCat = typeof p.category === 'object' 
          ? (p.category.name || p.category.title || '')
          : (p.category || '');
        return productCat.toString().trim().toLowerCase() === categoryFilter.toString().trim().toLowerCase();
      });
    }

    if (sortBy === 'price-low-high') {
      data.sort((a, b) => Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0));
    } else if (sortBy === 'price-high-low') {
      data.sort((a, b) => Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0));
    } else if (sortBy === 'newest') {
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy === 'popularity') {
      data.sort((a, b) => Number(b.total_sales || b.popularity || 0) - Number(a.total_sales || a.popularity || 0));
    } else {
       data.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return data;
  }, [products, categoryFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleCategoryChange = (e) => {
    searchParams.set('category', e.target.value);
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'All Products' }]} />

      <div className="filter-bar">
        <div className="filter-left">
          <label>
            <span>Category:</span>
            <select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="all">All</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort by:</span>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="popularity">Popularity</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
        <div className="filter-right">
          <span>{loading ? 'Loading...' : `${filteredProducts.length} Products`}</span>
        </div>
      </div>

      <div className="products-grid">
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : loading ? (
          <p>Loading products...</p>
        ) : currentItems.length === 0 ? (
          <p>No products found</p>
        ) : (
          currentItems.map((p, i) => <ProductCard key={i} product={p} />)
        )}
      </div>

      {!loading && totalPages > 0 && (
        <div className="pagination">
          <button onClick={() => goToPage(1)}>« First</button>
          <button onClick={() => goToPage(currentPage - 1)}>‹ Prev</button>
          <span id="pageNumbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button 
                key={pageNum}
                className={pageNum === currentPage ? "active" : ""}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </span>
          <button onClick={() => goToPage(currentPage + 1)}>Next ›</button>
          <button onClick={() => goToPage(totalPages)}>Last »</button>
        </div>
      )}

      {/* SOCIAL PROOF */}
      <div className="proof-banner">
        <div className="proof-stat">
          <div className="proof-num">500+</div>
          <div className="proof-lbl">Happy Customers</div>
        </div>
        <div className="proof-stat">
          <div className="proof-num">4.8★</div>
          <div className="proof-lbl">Average Rating</div>
        </div>
        <div className="proof-stat">
          <div className="proof-num">100%</div>
          <div className="proof-lbl">Genuine Leather</div>
        </div>
        <div className="proof-stat">
          <div className="proof-num">0%</div>
          <div className="proof-lbl">Return Rate</div>
        </div>
      </div>

      {/* QUALITY PROMISE SECTION */}
      <div className="lp-section">
        <div className="lp-head">
          <div className="lp-title">Our Quality Promise</div>
        </div>
        <div className="lp-body">
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🛡️</div>
              <div className="why-name">Premium Materials</div>
              <div className="why-desc">Crafted from top-grade genuine leather for lasting durability.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">✂️</div>
              <div className="why-name">Expert Craftsmanship</div>
              <div className="why-desc">Every stitch and cut is executed with precision by artisans.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">🔍</div>
              <div className="why-name">Strict Quality Control</div>
              <div className="why-desc">Rigorous multi-point checks ensure flawless final products.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">✅</div>
              <div className="why-name">Authenticity Guaranteed</div>
              <div className="why-desc">We guarantee 100% authentic products with every purchase.</div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER TRUST SECTION */}
      <div className="lp-section">
        <div className="lp-head">
          <div className="lp-title">Shopping Advantages</div>
        </div>
        <div className="lp-body">
          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon">🚚</div>
              <div>
                <div className="feat-name">Fast & Secure Delivery</div>
                <div className="feat-desc">Get your products delivered safely to your doorstep within 1-3 business days.</div>
                <div className="feat-tags">
                  <span className="feat-tag">Trackable</span>
                  <span className="feat-tag">Safe Packaging</span>
                </div>
              </div>
            </div>
            <div className="feat-card">
              <div className="feat-icon">💵</div>
              <div>
                <div className="feat-name">Cash on Delivery</div>
                <div className="feat-desc">Pay only when you receive your product in hand. Secure and hassle-free.</div>
                <div className="feat-tags">
                  <span className="feat-tag">No Prepayment</span>
                </div>
              </div>
            </div>
            <div className="feat-card">
              <div className="feat-icon">📞</div>
              <div>
                <div className="feat-name">Dedicated Support</div>
                <div className="feat-desc">Our support team is always ready to assist you with any product inquiries.</div>
                <div className="feat-tags">
                  <span className="feat-tag">WhatsApp Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

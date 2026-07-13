import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE } from '../utils/config';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';

export default function Home() {
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
  const perPage = 6;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let apiUrl = `${API_BASE}/api/ecom/products/`;
        // Pass any existing query parameters from the URL directly to the API if needed
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
        
        // Extract unique categories
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
  }, [searchParams]); // Re-fetch if URL parameters change

  // Filter and sort the products locally
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Filter by Category
    if (categoryFilter !== 'all') {
      data = data.filter(p => {
        let productCat = typeof p.category === 'object' 
          ? (p.category.name || p.category.title || '')
          : (p.category || '');
        return productCat.toString().trim().toLowerCase() === categoryFilter.toString().trim().toLowerCase();
      });
    }

    // Sort
    if (sortBy === 'price-low-high') {
      data.sort((a, b) => Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0));
    } else if (sortBy === 'price-high-low') {
      data.sort((a, b) => Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0));
    } else if (sortBy === 'newest') {
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy === 'popularity') {
      data.sort((a, b) => Number(b.total_sales || b.popularity || 0) - Number(a.total_sales || a.popularity || 0));
    } else {
       // default to newest
       data.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return data;
  }, [products, categoryFilter, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, sortBy]);

  // Hero Slider uses the top 3 items of the currently filtered items (or top 3 overall? The original script used `SLIDES = [...filteredProducts].slice(0, 3)`)
  const slides = useMemo(() => filteredProducts.slice(0, 3), [filteredProducts]);

  // Pagination logic
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
      <HeroSlider slides={slides} />

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

      {/* WHY SECTION */}
      <div className="lp-section">
        <div className="lp-head">
          <div className="lp-title">Why Choose Pencilwood</div>
        </div>
        <div className="lp-body">
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">✨</div>
              <div className="why-name">Elegant Minimal Design</div>
              <div className="why-desc">Slim profiles, clean lines.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">🚚</div>
              <div className="why-name">Fast Local Delivery</div>
              <div className="why-desc">Same-day in Dhaka area.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">💵</div>
              <div className="why-name">Cash on Delivery</div>
              <div className="why-desc">Pay on delivery.</div>
            </div>
            <div className="why-card">
              <div className="why-icon">🤝</div>
              <div className="why-name">WhatsApp Support</div>
              <div className="why-desc">Fast support available.</div>
            </div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE */}
      <div className="lp-section">
        <div className="lp-head">
          <div className="lp-title">See It in Real Life</div>
        </div>
        <div className="lp-body">
          <div className="lifestyle-grid">
            <div className="ls-card">
              <div className="ls-img a">👔</div>
              <div className="ls-copy">
                <div className="ls-copy-title">Designed for Professionals</div>
                <div className="ls-copy-sub">Office-ready</div>
              </div>
            </div>
            <div className="ls-card">
              <div className="ls-img b">✈️</div>
              <div className="ls-copy">
                <div className="ls-copy-title">Travel Companion</div>
                <div className="ls-copy-sub">Safe & stylish</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

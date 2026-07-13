import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/config';

export default function HeroSlider({ slides }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goSlide = (i) => setCurrentSlide(i);

  return (
    <div className="hero-slider">
      {slides.map((p, i) => {
        const image = p.image ? (p.image.startsWith("http") ? p.image : API_BASE + p.image) : "";
        const slug = p.slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        return (
          <div key={i} className={`slide ${i === currentSlide ? "active" : ""}`}>
            <div className="slide-content">
              <div className="slide-text">
                <h2>{p.name}</h2>
                <p>৳ {p.discount_price || p.price}</p>
                <button onClick={() => navigate(`/product/${slug}`)}>
                  View Product
                </button>
              </div>
              <div className="slide-img">
                <img src={image} alt={p.name} />
              </div>
            </div>
          </div>
        );
      })}

      <button className="slide-prev" onClick={prevSlide}>‹</button>
      <button className="slide-next" onClick={nextSlide}>›</button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <span 
            key={i} 
            onClick={() => goSlide(i)}
            className={i === currentSlide ? "active" : ""}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default function EcoBar() {
  return (
    <div id="eco-container" className="eco-section">
      <span className="eco-lbl">Part of the Pencilwood Ecosystem</span>
      <div className="eco-links">
        <a className="eco-link" href="#"><span style={{ fontSize: '14px' }}>🏠</span> Pencilwood Home</a>
        <a className="eco-link" href="#"><span className="eco-dot" style={{ background: '#1E3A8A' }}></span> Pencilwood Kid</a>
        <a className="eco-link" href="#"><span className="eco-dot" style={{ background: '#2F855A' }}></span> Pencilwood Furniture</a>
      </div>
    </div>
  );
}

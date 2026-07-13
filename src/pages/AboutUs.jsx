import Breadcrumb from '../components/Breadcrumb';

export default function AboutUs() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About Us' }]} />

      <div className="page" style={{ paddingTop: '20px' }}>
        <div className="lp-section">
          <div className="lp-head">
            <div className="lp-title">About Pencilwood</div>
          </div>
          <div className="lp-body">
            <h2 style={{ fontSize: '24px', marginBottom: '15px', color: 'var(--br)' }}>Our Story</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--mid)', marginBottom: '20px' }}>
              Welcome to Pencilwood, where craftsmanship meets elegance. Founded with a passion for high-quality genuine leather products, we aim to provide stylish, durable, and functional accessories for the modern individual. Our journey started with a simple vision: to bring premium leather goods directly to you, maintaining authentic artistry and exceptional value.
            </p>

            <h2 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text)' }}>Our Mission</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--mid)', marginBottom: '20px' }}>
              To redefine everyday essentials by offering meticulously crafted leather wallets, belts, and accessories that age beautifully and tell a story of their own. We believe in sustainable practices and supporting local artisans.
            </p>

            <h2 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text)' }}>Our Vision</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--mid)', marginBottom: '30px' }}>
              To become the most trusted and preferred leather goods brand, renowned for uncompromising quality, timeless designs, and unmatched customer satisfaction.
            </p>

            <div className="why-grid" style={{ marginTop: '20px' }}>
              <div className="why-card">
                <div className="why-icon">🌟</div>
                <div className="why-name">Timeless Elegance</div>
                <div className="why-desc">Designs that never go out of style.</div>
              </div>
              <div className="why-card">
                <div className="why-icon">🛡️</div>
                <div className="why-name">Built to Last</div>
                <div className="why-desc">Durable leather that ages perfectly.</div>
              </div>
              <div className="why-card">
                <div className="why-icon">🤝</div>
                <div className="why-name">Customer First</div>
                <div className="why-desc">Your satisfaction is our priority.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

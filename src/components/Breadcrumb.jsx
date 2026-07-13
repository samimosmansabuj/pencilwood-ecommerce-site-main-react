import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <div className="bc-br-section" id="bc-br">
      <div className="bc-bar">
        <div className="bc">
          <Link to="/">Home</Link>
          <span>›</span>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={index}>
                {isLast ? (
                  <span className="breadcrumb-cur" style={{ color: 'var(--text)', fontWeight: 500 }}>
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link to={item.link}>{item.label}</Link>
                    <span>›</span>
                  </>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

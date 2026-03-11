import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => (
  <article className="card package-card">
    <div className="package-card-media pkg-media-natural">
      {pkg.thumbnail_url ? (
        <img src={pkg.thumbnail_url} alt={pkg.name} loading="lazy" />
      ) : (
        <div className="package-card-fallback">
          <div className="badge">#{pkg.destination}</div>
          <h3 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem' }}>{pkg.name}</h3>
        </div>
      )}
      {pkg.is_featured && <div className="package-card-badge">✦ Featured</div>}
    </div>

    <div className="package-card-body">
      <div className="package-card-name">{pkg.name}</div>
      <p className="package-card-description">
        {pkg.description?.slice(0, 130)}{pkg.description?.length > 130 ? '…' : ''}
      </p>

      <div className="package-card-footer">
        <div>
          <div className="package-card-label">From</div>
          <div className="package-card-price">
            {pkg.currency} {pkg.price?.toLocaleString?.() ?? pkg.price}
          </div>
        </div>
        <div className="package-card-meta">
          {pkg.duration_days} days<br />
          <strong style={{ color: 'var(--forest)' }}>{pkg.destination}</strong>
        </div>
      </div>

      <Link to={`/packages/${pkg.id}`} className="package-card-cta">
        View details →
      </Link>
    </div>
  </article>
);

export default PackageCard;
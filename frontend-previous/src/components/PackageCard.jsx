import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  return (
    <article className="card package-card">
      <div className="package-card-media">
        {pkg.thumbnail_url ? (
          <img src={pkg.thumbnail_url} alt={pkg.name} />
        ) : (
          <div className="package-card-fallback">
            <div className="badge">#{pkg.destination}</div>
            <h3>{pkg.name}</h3>
            <p>
              {pkg.duration_days} days · from {pkg.currency}{' '}
              {pkg.price?.toLocaleString?.() ?? pkg.price}
            </p>
          </div>
        )}
        {pkg.is_featured && <div className="package-card-badge">Featured</div>}
      </div>

      <div className="package-card-body">
        <p className="package-card-description">
          {pkg.description?.slice(0, 140)}
          {pkg.description && pkg.description.length > 140 ? '…' : ''}
        </p>

        <div className="package-card-footer">
          <div>
            <div className="package-card-label">From</div>
            <div className="package-card-price">
              {pkg.currency} {pkg.price?.toLocaleString?.() ?? pkg.price}
            </div>
          </div>
          <div className="package-card-meta">
            <span>
              {pkg.duration_days} days · <strong>{pkg.destination}</strong>
            </span>
          </div>
        </div>

        <Link to={`/packages/${pkg.id}`} className="btn package-card-cta">
          View trip details
        </Link>
      </div>
    </article>
  );
};

export default PackageCard;

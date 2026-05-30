import React, { useState, useRef } from 'react';

const CLOUD_NAME    = 'dpaeok9bc';
const UPLOAD_PRESET = 'Sangeethaholidays';
const MAX_MB        = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export default function CloudinaryUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [dragOver,  setDragOver]  = useState(false);
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type))
      return 'Only JPG, PNG, WebP or GIF files are allowed.';
    if (file.size > MAX_MB * 1024 * 1024)
      return `File must be under ${MAX_MB} MB.`;
    return null;
  };

  const upload = (file) => {
    const err = validate(file);
    if (err) { setError(err); return; }

    setError('');
    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 95));
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setProgress(100);
        onChange(data.secure_url);
        setTimeout(() => setProgress(0), 700);
      } else {
        setError('Upload failed. Please try again.');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network error. Please check your connection.');
    };

    xhr.send(fd);
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) upload(f);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) upload(f);
  };

  const circumference = 2 * Math.PI * 20;

  return (
    <div className="cld-wrap">
      {label && <div className="cld-label">{label}</div>}

      {value ? (
        <div className="cld-preview">
          <img
            src={value}
            alt="Uploaded preview"
            className="cld-preview-img"
            onError={(e) => { e.target.style.opacity = '0.3'; }}
          />
          <div className="cld-preview-overlay">
            <button
              type="button"
              className="cld-btn-change"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              ↑ Change Image
            </button>
            <button
              type="button"
              className="cld-btn-remove"
              onClick={() => onChange('')}
              disabled={uploading}
            >
              ✕ Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`cld-zone${dragOver ? ' cld-zone-over' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          {uploading ? (
            <div className="cld-uploading">
              <div className="cld-ring-wrap">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="20" stroke="#e8e3db" strokeWidth="3.5" />
                  <circle
                    cx="26" cy="26" r="20"
                    stroke="var(--forest)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      transition: 'stroke-dashoffset 0.25s ease',
                    }}
                  />
                </svg>
                <span className="cld-ring-pct">{progress}%</span>
              </div>
              <p className="cld-uploading-text">Uploading to Cloudinary…</p>
            </div>
          ) : (
            <>
              <div className="cld-zone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="cld-zone-text">Click to upload or drag &amp; drop</p>
              <p className="cld-zone-hint">JPG, PNG, WebP · Max {MAX_MB} MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />

      {error && <div className="cld-error-msg">⚠ {error}</div>}
    </div>
  );
}

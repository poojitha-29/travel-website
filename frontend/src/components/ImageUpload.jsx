import React, { useState, useRef } from 'react';

const CLOUD_NAME    = 'dpaeok9bc';
const UPLOAD_PRESET = 'Sangeethaholidays';
const MAX_MB        = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export default function ImageUpload({ value, onChange, label, allowUrl = true }) {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [dragOver,  setDragOver]  = useState(false);
  const [error,     setError]     = useState('');
  const [mode,      setMode]      = useState(allowUrl ? 'url' : 'upload');
  const inputRef = useRef(null);

  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, WebP or GIF allowed.';
    if (file.size > MAX_MB * 1024 * 1024) return `File must be under ${MAX_MB} MB.`;
    return null;
  };

  const upload = (file) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(''); setUploading(true); setProgress(0);

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
        setTimeout(() => setProgress(0), 600);
      } else {
        setError('Upload failed. Please try again.');
      }
    };
    xhr.onerror = () => { setUploading(false); setError('Network error.'); };
    xhr.send(fd);
  };

  const onFileChange = (e) => { const f = e.target.files[0]; if (f) upload(f); e.target.value = ''; };
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f); };

  // radius for the progress ring
  const R  = 18;
  const C  = 2 * Math.PI * R;

  return (
    <div className="iu-wrap">
      {label && <p className="iu-label">{label}</p>}

      {/* If we have a value — show preview */}
      {value ? (
        <div className="iu-preview">
          <img src={value} alt="preview" className="iu-preview-img" onError={e => { e.target.style.opacity = '0.2'; }} />
          <div className="iu-preview-bar">
            {allowUrl && (
              <button type="button" className="iu-pbar-btn" onClick={() => { setMode('url'); onChange(''); }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                URL
              </button>
            )}
            <button type="button" className="iu-pbar-btn" onClick={() => { setMode('upload'); inputRef.current?.click(); }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <button type="button" className="iu-pbar-btn iu-pbar-del" onClick={() => onChange('')}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="iu-input-area">
          {/* Mode switcher (only if URL allowed) */}
          {allowUrl && (
            <div className="iu-tabs">
              <button type="button" className={`iu-tab${mode === 'url' ? ' iu-tab-on' : ''}`} onClick={() => setMode('url')}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Paste URL
              </button>
              <button type="button" className={`iu-tab${mode === 'upload' ? ' iu-tab-on' : ''}`} onClick={() => setMode('upload')}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload File
              </button>
            </div>
          )}

          {/* URL mode */}
          {mode === 'url' && (
            <div className="iu-url-row">
              <svg className="iu-url-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <input
                className="iu-url-input"
                type="text"
                placeholder="https://example.com/photo.jpg"
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); const v = e.target.value.trim(); if (v) { onChange(v); e.target.value = ''; } }
                }}
                onBlur={e => { const v = e.target.value.trim(); if (v) { onChange(v); e.target.value = ''; } }}
              />
            </div>
          )}

          {/* Upload / drop zone */}
          {mode === 'upload' && (
            <div
              className={`iu-drop${dragOver ? ' iu-drop-over' : ''}${uploading ? ' iu-drop-busy' : ''}`}
              onClick={() => !uploading && inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
            >
              {uploading ? (
                <div className="iu-progress">
                  <div className="iu-ring">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r={R} stroke="#e2ddd7" strokeWidth="3" />
                      <circle
                        cx="22" cy="22" r={R}
                        stroke="var(--forest)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C - (C * progress / 100)}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.25s ease' }}
                      />
                    </svg>
                    <span className="iu-ring-pct">{progress}</span>
                  </div>
                  <span className="iu-progress-label">Uploading…</span>
                </div>
              ) : (
                <>
                  <div className="iu-drop-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="iu-drop-text">Drop image here or <span className="iu-drop-link">browse</span></p>
                  <p className="iu-drop-hint">JPG · PNG · WebP · max {MAX_MB} MB</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

      {error && (
        <div className="iu-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

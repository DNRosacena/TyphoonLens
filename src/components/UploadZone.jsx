import { useState, useRef } from 'react';
import { Upload, ImageIcon, X, Zap } from 'lucide-react';
import { compressImage, formatBytes } from '../assets/utils/compress';

export default function UploadZone({ onClassify, isProcessing }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (raw) => {
    if (!raw || !raw.type.startsWith('image/')) return;
    setFile(raw);
    setPreview(URL.createObjectURL(raw));
    setCompressing(true);
    setCompressedSize(null);
    try {
      const compressed = await compressImage(raw);
      setCompressedSize(compressed.size);
    } catch { /* ignore */ }
    setCompressing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clear = () => {
    setFile(null); setPreview(null); setCompressedSize(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (file) onClassify(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        style={{
          position: 'relative',
          height: file ? '220px' : '180px',
          border: `1px dashed ${dragOver ? 'var(--cyan)' : 'var(--border)'}`,
          background: dragOver ? 'rgba(0,229,255,0.04)' : 'var(--surface)',
          cursor: file ? 'default' : 'pointer',
          transition: 'all 0.2s',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {file ? (
          <>
            <img src={preview} alt="satellite" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,8,16,0.9) 0%, transparent 50%)' }} />
            <button onClick={e => { e.stopPropagation(); clear(); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(4,8,16,0.8)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
              <X size={13} />
            </button>
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--cyan)', marginBottom: '2px' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>
                  Original: {formatBytes(file.size)}
                  {compressedSize && <span style={{ color: '#00ff88', marginLeft: '8px' }}>→ Compressed: {formatBytes(compressedSize)}</span>}
                  {compressing && <span style={{ color: 'var(--warn)', marginLeft: '8px' }}>compressing...</span>}
                </p>
              </div>
            </div>

            {/* Corner scan lines */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => {
              const isTop = corner.includes('top'), isLeft = corner.includes('left');
              return (
                <div key={corner} style={{ position: 'absolute', [isTop ? 'top' : 'bottom']: '6px', [isLeft ? 'left' : 'right']: '6px', width: '14px', height: '14px', borderTop: isTop ? '1.5px solid var(--cyan)' : 'none', borderBottom: !isTop ? '1.5px solid var(--cyan)' : 'none', borderLeft: isLeft ? '1.5px solid var(--cyan)' : 'none', borderRight: !isLeft ? '1.5px solid var(--cyan)' : 'none' }} />
              );
            })}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={20} color="var(--muted)" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.06em', marginBottom: '5px' }}>
              DROP SATELLITE IMAGE
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.10em' }}>
              JPG · PNG · WEBP · Max 20MB
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--border)', letterSpacing: '0.08em', marginTop: '6px' }}>
              or click to browse
            </p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
      </div>

      {/* Analyze button */}
      <button
        className="btn-cyan"
        onClick={handleAnalyze}
        disabled={!file || isProcessing || compressing}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        {isProcessing ? (
          <>
            <div style={{ width: '13px', height: '13px', border: '2px solid rgba(4,8,16,0.3)', borderTop: '2px solid #040810', borderRadius: '50%', animation: 'radarSpin 0.7s linear infinite' }} />
            ANALYZING...
          </>
        ) : (
          <><Zap size={14} /> CLASSIFY TYPHOON</>
        )}
      </button>
    </div>
  );
}
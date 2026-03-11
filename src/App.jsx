import { useState, useRef } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultPanel from './components/ResultPanel';
import HistoryLog from './components/HistoryLog';
import { compressImage, fileToBase64 } from './assets/utils/compress';
import { classifyViaNgrok, classifyDirect } from './assets/utils/classifier';
import './App.css';

export default function App() {
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [stage, setStage] = useState('');
  const previewRef = useRef(null);

  const handleClassify = async (file) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setQueueCount(q => q + 1);

    try {
      setStage('Compressing image...');
      const compressed = await compressImage(file);
      const base64 = await fileToBase64(compressed);

      setStage('Sending to classifier...');
      setStage('Sending to Groq Vision...');
      const classResult = await classifyDirect(base64, compressed.type);

      setResult(classResult);

      // Add to history
      const entry = {
        filename: file.name,
        time: new Date().toLocaleTimeString(),
        preview: URL.createObjectURL(file),
        result: classResult,
      };
      setHistory(h => [entry, ...h].slice(0, 8));

    } catch (err) {
      setError(err.message || 'Classification failed');
    } finally {
      setIsProcessing(false);
      setQueueCount(q => Math.max(0, q - 1));
      setStage('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '56px' }}>
      <div className="scan-overlay" />
      <Header />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 20px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.7fr)', gap: '20px', alignItems: 'start' }}>

        {/* ── Left Column ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '6px' }}>SATELLITE ANALYSIS SYSTEM v1.0</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'white', lineHeight: 0.95 }}>
              Typhoon<br /><span style={{ color: 'var(--cyan)' }}>Classifier</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginTop: '10px', lineHeight: 1.65 }}>
              Upload a satellite image to classify typhoon intensity across PAGASA, Saffir-Simpson, and JMA scales using Gemini Vision AI.
            </p>
          </div>

          {/* Upload zone */}
          <div className="panel" style={{ padding: '14px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>IMAGE INPUT</p>
            <UploadZone onClassify={handleClassify} isProcessing={isProcessing} />
          </div>

          {/* Processing stage */}
          {isProcessing && stage && (
            <div style={{ padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ width: '28px', height: '28px', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--cyan)', opacity: 0.3, animation: 'radarSpin 3s linear infinite' }} />
                <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: '1px solid var(--cyan)', opacity: 0.5, animation: 'radarSpin 2s linear infinite reverse' }} />
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse 1s infinite' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.10em' }}>{stage}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 14px', background: 'rgba(255,23,68,0.07)', border: '1px solid rgba(255,23,68,0.25)', animation: 'fadeIn 0.3s ease' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#ff1744', letterSpacing: '0.08em' }}>ERROR: {error}</p>
            </div>
          )}

          {/* History */}
          <HistoryLog history={history} onSelect={e => setResult(e.result)} />
        </div>

        {/* ── Right Column ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!result && !isProcessing && (
            <div style={{ height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', background: 'var(--surface)', gap: '16px' }}>
              {/* Radar animation */}
              <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ position: 'absolute', inset: `${i * 16}px`, borderRadius: '50%', border: '1px solid var(--cyan)', opacity: 0.2 + i * 0.12, animation: `radarSpin ${4 + i}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}` }} />
                ))}
                <div style={{ position: 'absolute', inset: '42px', borderRadius: '50%', background: 'var(--cyan)', opacity: 0.08, animation: 'radarPing 2.5s ease-out infinite' }} />
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--cyan)', opacity: 0.6, boxShadow: '0 0 16px var(--cyan)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Awaiting Satellite Input</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--border)', letterSpacing: '0.10em' }}>Upload an image to begin classification</p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div style={{ height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--cyan-dim)', background: 'var(--surface)', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ position: 'absolute', inset: `${i * 12}px`, borderRadius: '50%', border: `1px solid var(--cyan)`, opacity: 0.3 + i * 0.18, animation: `radarSpin ${2 - i * 0.4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}` }} />
                ))}
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 20px var(--cyan)', animation: 'pulse 0.8s ease-in-out infinite' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.10em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>Analyzing</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)', letterSpacing: '0.12em', animation: 'blink 1.5s infinite' }}>GEMINI VISION PROCESSING...</p>
              </div>
            </div>
          )}

          {result && <ResultPanel result={result} />}
        </div>
      </div>
    </div>
  );
}
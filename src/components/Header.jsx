export default function Header() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '56px',
      background: 'rgba(4,8,16,0.94)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--cyan)', opacity: 0.4, animation: 'radarSpin 6s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: '1px solid var(--cyan)', opacity: 0.6, animation: 'radarSpin 4s linear infinite reverse' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', lineHeight: 1 }}>
            Typhoon<span style={{ color: 'var(--cyan)' }}>Lens</span>
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.18em', color: 'var(--muted)', lineHeight: 1, marginTop: '1px' }}>
            SATELLITE CLASSIFICATION SYSTEM
          </p>
        </div>
      </div>

      {/* Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {['PAGASA', 'SAFFIR-SIMPSON', 'JMA'].map(scale => (
          <div key={scale} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--muted)' }}>{scale}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
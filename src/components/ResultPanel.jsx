import { AlertTriangle, Wind, Gauge, Waves, CloudRain } from 'lucide-react';

const PAGASA_ORDER = ['TD', 'TS', 'STS', 'TY', 'STY'];
const SS_ORDER = ['TD', 'TS', 'CAT1', 'CAT2', 'CAT3', 'CAT4', 'CAT5'];

function getBadgeClass(scale, classification) {
  const c = classification?.toUpperCase();
  if (c === 'TD') return 'badge-td';
  if (c === 'TS') return 'badge-ts';
  if (c === 'STS') return 'badge-sts';
  if (c === 'TY') return 'badge-ty';
  if (c === 'STY') return 'badge-sty';
  if (c === 'CAT1') return 'badge-cat1';
  if (c === 'CAT2') return 'badge-cat2';
  if (c === 'CAT3') return 'badge-cat3';
  if (c === 'CAT4') return 'badge-cat4';
  if (c === 'CAT5') return 'badge-cat5';
  return 'badge-unknown';
}

function IntensityBar({ order, current }) {
  const idx = order.indexOf(current?.toUpperCase());
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '8px' }}>
      {order.map((level, i) => (
        <div key={level} style={{ flex: 1, height: '4px', background: i <= idx ? 'var(--cyan)' : 'var(--border)', boxShadow: i === idx ? '0 0 6px var(--cyan)' : 'none', transition: 'all 0.3s' }} />
      ))}
    </div>
  );
}

function ScaleCard({ title, subtitle, flag, data, order, windLabel, windValue, extra }) {
  if (!data) return null;
  const badgeClass = getBadgeClass('', data.classification);

  return (
    <div className="panel-2" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.1rem' }}>{flag}</span>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white' }}>{title}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.50rem', color: 'var(--muted)', letterSpacing: '0.10em' }}>{subtitle}</p>
        </div>
      </div>

      {/* Badge + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className={badgeClass} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', letterSpacing: '0.10em' }}>
          {data.classification}
        </span>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, color: 'white', letterSpacing: '0.04em' }}>
          {data.label}
        </p>
      </div>

      {/* Intensity bar */}
      {order && <IntensityBar order={order} current={data.classification} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '2px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.50rem', color: 'var(--muted)', letterSpacing: '0.10em', marginBottom: '3px' }}>WIND ({windLabel})</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--cyan)' }}>{windValue}</p>
        </div>
        {extra && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.50rem', color: 'var(--muted)', letterSpacing: '0.10em', marginBottom: '3px' }}>{extra.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>{extra.value}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(200,223,240,0.55)', lineHeight: 1.6, borderLeft: '2px solid var(--border)', paddingLeft: '8px' }}>
        {data.description}
      </p>
    </div>
  );
}

function RiskRow({ icon: Icon, label, value }) {
  const colors = { None: '#3a5a78', Low: '#00ff88', Moderate: '#ffee4a', High: '#ff6b00', Extreme: '#ff1744' };
  const color = colors[value] || '#3a5a78';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(14,32,64,0.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <Icon size={12} color="var(--muted)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', color: 'var(--muted)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '0.06em' }}>{value}</span>
    </div>
  );
}

export default function ResultPanel({ result }) {
  if (!result) return null;

  if (!result.detected) {
    return (
      <div className="panel" style={{ padding: '24px', textAlign: 'center', animation: 'fadeUp 0.4s ease' }}>
        <AlertTriangle size={28} color="var(--warn)" style={{ margin: '0 auto 12px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'white', letterSpacing: '0.06em', marginBottom: '8px' }}>
          NO CYCLONE DETECTED
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>{result.analysis}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeUp 0.35s ease' }}>
      {/* Analysis summary */}
      <div className="panel" style={{ padding: '16px', borderLeft: '3px solid var(--cyan)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cyan)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '7px' }}>
          SATELLITE ANALYSIS — {result.confidence?.toUpperCase()} CONFIDENCE
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.7 }}>{result.analysis}</p>
        {result.destructive_potential && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#ff6b00', lineHeight: 1.6, marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            ⚠ {result.destructive_potential}
          </p>
        )}
      </div>

      {/* 3 Scale Cards */}
      <ScaleCard
        title="PAGASA" subtitle="Philippine Atmospheric" flag="🇵🇭"
        data={result.pagasa} order={PAGASA_ORDER}
        windLabel="km/h" windValue={result.pagasa?.wind_kmh_sustained}
        extra={{ label: 'PSWS SIGNAL', value: result.pagasa?.signal || 'N/A' }}
      />
      <ScaleCard
        title="Saffir-Simpson" subtitle="US Hurricane Scale" flag="🌍"
        data={result.saffir_simpson} order={SS_ORDER}
        windLabel="mph" windValue={result.saffir_simpson?.wind_mph_sustained}
        extra={{ label: 'DAMAGE', value: result.saffir_simpson?.damage_potential }}
      />
      <ScaleCard
        title="JMA" subtitle="Japan Meteorological Agency" flag="🇯🇵"
        data={result.jma}
        windLabel="m/s" windValue={result.jma?.wind_ms_10min}
        extra={{ label: 'PRESSURE', value: result.jma?.central_pressure_hpa ? `${result.jma.central_pressure_hpa} hPa` : '---' }}
      />

      {/* Risk summary */}
      <div className="panel" style={{ padding: '14px 16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '8px' }}>Risk Assessment</p>
        <RiskRow icon={Waves}    label="Storm Surge" value={result.storm_surge_risk || 'Unknown'} />
        <RiskRow icon={CloudRain} label="Rainfall"   value={result.rainfall_risk || 'Unknown'} />
        <RiskRow icon={Wind}     label="Est. Diameter" value={result.estimated_diameter_km ? `${result.estimated_diameter_km} km` : 'Unknown'} />
      </div>
    </div>
  );
}
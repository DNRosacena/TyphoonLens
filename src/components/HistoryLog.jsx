import { Clock, ChevronRight } from 'lucide-react';

function getBadgeClass(c) {
  const map = { TD: 'badge-td', TS: 'badge-ts', STS: 'badge-sts', TY: 'badge-ty', STY: 'badge-sty', CAT1: 'badge-cat1', CAT2: 'badge-cat2', CAT3: 'badge-cat3', CAT4: 'badge-cat4', CAT5: 'badge-cat5' };
  return map[c?.toUpperCase()] || 'badge-unknown';
}

export default function HistoryLog({ history, onSelect }) {
  if (!history.length) return null;

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <Clock size={11} color="var(--cyan)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.60rem', letterSpacing: '0.14em', color: 'var(--cyan)', textTransform: 'uppercase' }}>
          Session History ({history.length})
        </span>
      </div>
      {history.map((entry, i) => (
        <button key={i} onClick={() => onSelect(entry)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', background: 'transparent', border: 'none', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {entry.preview && (
            <img src={entry.preview} alt="" style={{ width: '36px', height: '28px', objectFit: 'cover', flexShrink: 0, opacity: 0.75 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              {entry.result?.pagasa?.classification && (
                <span className={getBadgeClass(entry.result.pagasa.classification)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', padding: '1px 6px' }}>
                  {entry.result.pagasa.classification}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.filename}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.50rem', color: 'var(--muted)' }}>{entry.time}</p>
          </div>
          <ChevronRight size={11} color="var(--muted)" />
        </button>
      ))}
    </div>
  );
}
const StatCard = ({ label, value, sub, color }) => (
  <div style={{
    background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '2px',
    padding: '16px', flex: 1
  }}>
    <div style={{ fontSize: '10px', color: '#999', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: color || '#f0f0f0' }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: '10px', color: '#333', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>{sub}</div>}
  </div>
)

export default function OutbreakReport({ stats, report }) {
  if (!stats) {
    return (
      <div style={{
        background: '#111', border: '1px solid #222', borderRadius: '2px',
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.15 }}>⬡</div>
        <div style={{ color: '#333', fontSize: '12px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textAlign: 'center' }}>
          AWAITING SIMULATION<br />
          <span style={{ color: '#222', fontSize: '10px' }}>Report will appear here</span>
        </div>
      </div>
    )
  }

  const r0 = stats.r0 ?? 0
  const corr = stats.correlation ?? 0
  const corrColor = corr > 0.7 ? '#22c55e' : corr > 0.4 ? '#f59e0b' : '#ef4444'
  const r0Color = r0 > 2 ? '#ef4444' : r0 > 1 ? '#f59e0b' : '#22c55e'

  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '2px',
      padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto'
    }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', color: '#999', letterSpacing: '0.15em', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
          Analysis
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Outbreak Report
        </h2>
      </div>

      {/* Stat cards row 1 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <StatCard label="R₀" value={r0.toFixed(2)} sub="reproduction number" color={r0Color} />
        <StatCard label="Peak Infected" value={stats.peak_infected?.toLocaleString() ?? '—'} sub={`day ${stats.peak_day ?? '—'}`} color="#ef4444" />
      </div>

      {/* Stat cards row 2 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <StatCard label="Total Recovered" value={stats.total_recovered?.toLocaleString() ?? '—'} sub="by end of sim" color="#666" />
        <StatCard label="CDC Correlation" value={corr.toFixed(3)} sub="pearson r" color={corrColor} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1a1a1a', marginBottom: '20px' }} />

      {/* Report text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#999', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Epidemiologist Report
        </div>
        {report ? (
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#bbb' }}>
            {report.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
            ))}
          </div>
        ) : (
          <div style={{ color: '#333', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
            No report generated.
          </div>
        )}
      </div>

      {/* Beta / Gamma footer */}
      <div style={{ marginTop: '20px', padding: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { label: 'β (transmission)', value: stats.beta?.toFixed(3) },
            { label: 'γ (recovery)', value: stats.gamma?.toFixed(3) },
            { label: 'sim days', value: stats.simulation_days },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#333', fontFamily: 'Space Mono, monospace', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Space Mono, monospace', color: '#555' }}>{value ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
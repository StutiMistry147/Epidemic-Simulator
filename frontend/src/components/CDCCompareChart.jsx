import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '2px',
      padding: '12px 16px', fontFamily: 'Space Mono, monospace', fontSize: '11px'
    }}>
      <div style={{ color: '#555', marginBottom: '8px' }}>Day {label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: '2px' }}>
          {p.dataKey === 'sim' ? 'Simulation' : 'CDC Flu 2023'}: {(p.value * 100).toFixed(1)}%
        </div>
      ))}
    </div>
  )
}

export default function CDCCompareChart({ timeseries, cdcCurve, correlation }) {
  if (!timeseries || !cdcCurve) return null

  // Normalize sim I curve to peak = 1
  const simInfected = timeseries.map(d => d.I)
  const simPeak = Math.max(...simInfected)

  // Build merged dataset on shared day axis
  const cdcMap = {}
  cdcCurve.forEach(d => { cdcMap[d.day] = d.value })

  const data = timeseries
    .filter((_, i) => i % Math.ceil(timeseries.length / 200) === 0 || i === timeseries.length - 1)
    .map(d => ({
      day: d.day,
      sim: simPeak > 0 ? parseFloat((d.I / simPeak).toFixed(4)) : 0,
      cdc: cdcMap[d.day] !== undefined ? parseFloat(cdcMap[d.day].toFixed(4)) : null,
    }))

  const corrColor = Math.abs(correlation) > 0.7 ? '#22c55e'
    : Math.abs(correlation) > 0.4 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '2px',
      padding: '24px', display: 'flex', flexDirection: 'column'
    }} className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
            Validation
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Sim vs CDC 2023
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', marginBottom: '4px' }}>
            PEARSON r
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: corrColor, letterSpacing: '-0.03em' }}>
            {correlation?.toFixed(3) ?? '—'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '2px', background: '#ef4444' }} />
          <span style={{ fontSize: '10px', color: '#777', fontFamily: 'Space Mono, monospace' }}>Simulation (normalized)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '2px', background: '#e2e8f0', opacity: 0.6 }} />
          <span style={{ fontSize: '10px', color: '#777', fontFamily: 'Space Mono, monospace' }}>CDC Flu 2023 (normalized)</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis
              dataKey="day"
              stroke="#333"
              tick={{ fill: '#444', fontSize: 10, fontFamily: 'Space Mono, monospace' }}
              label={{ value: 'Days', position: 'insideBottomRight', offset: -5, fill: '#444', fontSize: 10 }}
            />
            <YAxis
              stroke="#333"
              tick={{ fill: '#444', fontSize: 10, fontFamily: 'Space Mono, monospace' }}
              tickFormatter={v => `${(v * 100).toFixed(0)}%`}
              domain={[0, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={1} stroke="#222" strokeDasharray="4 4" />
            <Line
              type="monotone" dataKey="sim" stroke="#ef4444"
              dot={false} strokeWidth={2} connectNulls
            />
            <Line
              type="monotone" dataKey="cdc" stroke="#e2e8f0"
              dot={false} strokeWidth={2} strokeOpacity={0.6}
              connectNulls strokeDasharray="6 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretation */}
      <div style={{
        marginTop: '16px', padding: '12px', background: '#0a0a0a',
        border: '1px solid #1a1a1a', borderRadius: '2px',
        fontSize: '11px', color: '#555', fontFamily: 'Space Mono, monospace', lineHeight: '1.6'
      }}>
        {Math.abs(correlation) > 0.7
          ? '✓ Strong match with real flu season dynamics'
          : Math.abs(correlation) > 0.4
          ? '~ Moderate correlation — try adjusting β and γ to better fit CDC curve'
          : '✗ Low correlation — sim curve shape differs from real flu season. Lower β or increase days.'}
      </div>
    </div>
  )
}
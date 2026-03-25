import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
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
          {p.dataKey}: {p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

export default function SIRChart({ timeseries }) {
  if (!timeseries || timeseries.length === 0) {
    return (
      <div style={{
        background: '#111', border: '1px solid #222', borderRadius: '2px',
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.15 }}>◎</div>
        <div style={{ color: '#333', fontSize: '12px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textAlign: 'center' }}>
          NO DATA YET<br />
          <span style={{ color: '#222', fontSize: '10px' }}>Configure parameters and run simulation</span>
        </div>
      </div>
    )
  }

  // Downsample if too many points
  const data = timeseries.length > 180
    ? timeseries.filter((_, i) => i % Math.ceil(timeseries.length / 180) === 0)
    : timeseries

  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '2px',
      padding: '24px', height: '100%', display: 'flex', flexDirection: 'column'
    }} className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
          Compartmental Model
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          SEIR Curve
        </h2>
      </div>

      {/* Compartment legend pills */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'S', label: 'Susceptible', color: '#3b82f6' },
          { key: 'E', label: 'Exposed', color: '#f59e0b' },
          { key: 'I', label: 'Infected', color: '#ef4444' },
          { key: 'R', label: 'Recovered', color: '#22c55e' },
        ].map(({ key, label, color }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '2px', background: color }} />
            <span style={{ fontSize: '10px', color: '#555', fontFamily: 'Space Mono, monospace' }}>
              {key} – {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
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
              tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="S" stroke="#3b82f6" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="E" stroke="#f59e0b" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="I" stroke="#ef4444" dot={false} strokeWidth={2.5} />
            <Line type="monotone" dataKey="R" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { useState } from 'react'

const SliderRow = ({ label, name, min, max, step, value, onChange, format }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-2">
      <span style={{ color: '#aaa', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace' }}>
        {label}
      </span>
      <span style={{ color: '#ff3a3a', fontSize: '13px', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
        {format ? format(value) : value}
      </span>
    </div>
    <div style={{ position: 'relative', height: '4px', background: '#222', borderRadius: '2px' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${((value - min) / (max - min)) * 100}%`,
        background: 'linear-gradient(90deg, #ff3a3a, #ff8c00)',
        borderRadius: '2px', transition: 'width 0.1s'
      }} />
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(name, parseFloat(e.target.value))}
        style={{
          position: 'absolute', width: '100%', height: '100%', opacity: 0,
          cursor: 'pointer', top: 0, left: 0, margin: 0
        }}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
      <span style={{ color: '#333', fontSize: '10px', fontFamily: 'Space Mono, monospace' }}>{min}</span>
      <span style={{ color: '#333', fontSize: '10px', fontFamily: 'Space Mono, monospace' }}>{max}</span>
    </div>
  </div>
)

export default function SimControls({ onSimulate, loading }) {
  const [params, setParams] = useState({
    population: 1000,
    beta: 0.3,
    gamma: 0.1,
    days: 90,
    network: 'random',
    lockdown: false,
    vaccination: 0,
  })

  const update = (name, value) => setParams(p => ({ ...p, [name]: value }))

  const r0 = (params.beta / params.gamma).toFixed(2)

  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '2px',
      padding: '24px', height: '100%', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3a3a', animation: 'pulse-red 2s infinite' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#555', fontFamily: 'Space Mono, monospace', textTransform: 'uppercase' }}>
            Parameters
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Simulation Config
        </h2>
      </div>

      {/* R0 display */}
      <div style={{
        background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '2px',
        padding: '16px', marginBottom: '24px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', fontFamily: 'Space Mono, monospace', marginBottom: '4px' }}>
          BASIC REPRODUCTION NUMBER
        </div>
        <div style={{
          fontSize: '48px', fontWeight: 800, letterSpacing: '-0.04em',
          color: parseFloat(r0) > 2 ? '#ff3a3a' : parseFloat(r0) > 1 ? '#f59e0b' : '#22c55e'
        }}>
          R₀ = {r0}
        </div>
        <div style={{ fontSize: '10px', color: '#444', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
          {parseFloat(r0) > 2 ? '⚠ HIGH TRANSMISSION' : parseFloat(r0) > 1 ? '~ MODERATE' : '✓ CONTROLLED'}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ flex: 1 }}>
        <SliderRow label="Population" name="population" min={100} max={10000} step={100}
          value={params.population} onChange={update} format={v => v.toLocaleString()} />
        <SliderRow label="Transmission Rate β" name="beta" min={0.05} max={1.0} step={0.01}
          value={params.beta} onChange={update} />
        <SliderRow label="Recovery Rate γ" name="gamma" min={0.01} max={0.5} step={0.01}
          value={params.gamma} onChange={update} />
        <SliderRow label="Simulation Days" name="days" min={30} max={365} step={5}
          value={params.days} onChange={update} />

        {/* Network type */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: '10px' }}>
            Network Topology
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['random', 'small_world'].map(n => (
              <button key={n} onClick={() => update('network', n)} style={{
                flex: 1, padding: '8px', border: `1px solid ${params.network === n ? '#ff3a3a' : '#222'}`,
                background: params.network === n ? 'rgba(255,58,58,0.08)' : 'transparent',
                color: params.network === n ? '#ff3a3a' : '#555',
                borderRadius: '2px', cursor: 'pointer', fontSize: '11px',
                fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em',
                textTransform: 'uppercase', transition: 'all 0.15s'
              }}>
                {n === 'random' ? 'Erdős–Rényi' : 'Watts–Strogatz'}
              </button>
            ))}
          </div>
        </div>

        {/* Interventions */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: '10px' }}>
            Interventions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div onClick={() => update('lockdown', !params.lockdown)} style={{
              width: '32px', height: '18px', borderRadius: '9px',
              background: params.lockdown ? '#ff3a3a' : '#222',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
            }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: params.lockdown ? '17px' : '3px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s'
              }} />
            </div>
            <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'Space Mono, monospace' }}>
              Lockdown (β × 0.4)
            </span>
          </div>
          <SliderRow label="Vaccination %" name="vaccination" min={0} max={80} step={1}
            value={params.vaccination} onChange={update} format={v => `${v}%`} />
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={() => onSimulate(params)}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', marginTop: '8px',
          background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #ff3a3a, #ff8c00)',
          border: 'none', borderRadius: '2px', color: loading ? '#444' : '#fff',
          fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'Space Mono, monospace',
          cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
        }}
      >
        {loading ? '◌  Running...' : '▶  Run Simulation'}
      </button>
    </div>
  )
}

import { useState } from 'react'
import axios from 'axios'
import SimControls from './components/SimControls'
import SIRChart from './components/SIRChart'
import OutbreakReport from './components/OutbreakReport'
import CDCCompareChart from './components/CDCCompareChart'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [timeseries, setTimeseries] = useState(null)
  const [stats, setStats] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSimulate = async (params) => {
    setLoading(true)
    setError(null)

    // Apply interventions to params before sending
    let effectiveBeta = params.beta
    if (params.lockdown) effectiveBeta *= 0.4

    // Vaccination reduces initial susceptible population
    const vaccinatedFraction = params.vaccination / 100
    const effectivePopulation = Math.round(params.population * (1 - vaccinatedFraction))

    const payload = {
      population: effectivePopulation,
      beta: parseFloat(effectiveBeta.toFixed(4)),
      gamma: params.gamma,
      days: params.days,
      network: params.network,
    }

    try {
      const res = await axios.post(`${API_URL}/simulate`, payload)
      setTimeseries(res.data.timeseries)
      setStats(res.data.stats)
      setReport(res.data.report)
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        borderBottom: '1px solid #1a1a1a', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '52px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: '3px', height: `${8 + i * 4}px`, background: '#ff3a3a',
                opacity: 0.4 + i * 0.3, borderRadius: '1px'
              }} />
            ))}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Epidemic Simulator
          </span>
          <span style={{ fontSize: '10px', color: '#333', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}>
            SEIR + ABM
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff8c00', animation: 'pulse-red 1s infinite' }} />
              <span style={{ fontSize: '10px', color: '#555', fontFamily: 'Space Mono, monospace' }}>SIMULATING</span>
            </div>
          )}
          {timeseries && !loading && (
            <span style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'Space Mono, monospace' }}>
              ✓ {timeseries.length} DAYS COMPUTED
            </span>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          padding: '10px 24px', fontSize: '12px', color: '#ef4444',
          fontFamily: 'Space Mono, monospace'
        }}>
          ✗ {error}
        </div>
      )}

      {/* Main layout */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '300px 1fr 320px',
        gap: '1px', background: '#1a1a1a',
        padding: '1px', minHeight: 0
      }}>
        {/* Left: controls */}
        <div style={{ background: '#0a0a0a', overflow: 'auto' }}>
          <SimControls onSimulate={handleSimulate} loading={loading} />
        </div>

        {/* Center: charts stacked */}
        <div style={{ background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: '1px', minHeight: '500px' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SIRChart timeseries={timeseries} />
          </div>
          {timeseries && stats?.cdc_curve && (
            <div style={{ flexShrink: 0 }}>
              <CDCCompareChart
                timeseries={timeseries}
                cdcCurve={stats.cdc_curve}
                correlation={stats.correlation}
              />
            </div>
          )}
        </div>

        {/* Right: report */}
        <div style={{ background: '#0a0a0a', overflow: 'auto' }}>
          <OutbreakReport stats={stats} report={report} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1a1a1a', padding: '8px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: '10px', color: '#222', fontFamily: 'Space Mono, monospace' }}>
          C++ SEIR ENGINE + PTHREADS · FASTAPI · REACT
        </span>
        <span style={{ fontSize: '10px', color: '#222', fontFamily: 'Space Mono, monospace' }}>
          WATTS–STROGATZ · ERDŐS–RÉNYI
        </span>
      </footer>
    </div>
  )
}
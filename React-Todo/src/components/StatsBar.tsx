import type { FilterStatus } from '../types/todo'

interface Stats {
  total: number
  completed: number
  active: number
  overdue: number
  starred: number
  pct: number
}

interface StatsBarProps {
  stats: Stats
  status: FilterStatus
  onStatus: (s: FilterStatus) => void
}

const CHIPS: { key: FilterStatus; label: string; color: string }[] = [
  { key: 'all',       label: 'All',     color: '#6366f1' },
  { key: 'active',    label: 'Active',  color: '#3b82f6' },
  { key: 'completed', label: 'Done',    color: '#22c55e' },
  { key: 'overdue',   label: 'Overdue', color: '#ef4444' },
  { key: 'starred',   label: 'Starred', color: '#f59e0b' },
]

function countFor(stats: Stats, key: FilterStatus): number {
  if (key === 'all')       return stats.total
  if (key === 'active')    return stats.active
  if (key === 'completed') return stats.completed
  if (key === 'overdue')   return stats.overdue
  return stats.starred
}

export default function StatsBar({ stats, status, onStatus }: StatsBarProps) {
  const R      = 28
  const C      = 2 * Math.PI * R
  const offset = C - (stats.pct / 100) * C

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

      {/* SVG ring */}
      <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
        <svg width="72" height="72" className="stats-ring">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r={R} fill="none" stroke="var(--border)"     strokeWidth="5" />
          <circle cx="36" cy="36" r={R} fill="none" stroke="url(#ringGrad)"    strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            className="stats-arc"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
            {stats.pct}%
          </span>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>done</span>
        </div>
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CHIPS.map(chip => (
          <button
            key={chip.key}
            onClick={() => onStatus(chip.key)}
            className="ftab"
            style={status === chip.key ? {
              background: chip.color, borderColor: chip.color, color: 'white',
            } : {}}
          >
            <span style={{
              color: status === chip.key ? 'white' : chip.color,
              fontWeight: 700, marginRight: 3,
            }}>
              {countFor(stats, chip.key)}
            </span>
            {chip.label}
          </button>
        ))}
      </div>

    </div>
  )
}

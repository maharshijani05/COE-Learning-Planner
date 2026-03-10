import type { Category, Priority, SortBy } from '../types/todo'
import { CATEGORY_CONFIG } from '../types/todo'

interface FilterBarProps {
  search: string
  onSearch: (v: string) => void
  catFilter: Category | 'all'
  onCatFilter: (v: Category | 'all') => void
  priFilter: Priority | 'all'
  onPriFilter: (v: Priority | 'all') => void
  sortBy: SortBy
  onSortBy: (v: SortBy) => void
  completedCount: number
  totalCount: number
  onDeleteCompleted: () => void
  onMarkAllDone: () => void
  onClearAll: () => void
}

export default function FilterBar({
  search, onSearch,
  catFilter, onCatFilter,
  priFilter, onPriFilter,
  sortBy, onSortBy,
  completedCount, totalCount,
  onDeleteCompleted, onMarkAllDone, onClearAll,
}: FilterBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
          fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search tasks and notes..."
          className="u-input"
          style={{ paddingLeft: 34 }}
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 15, lineHeight: 1, padding: 0,
            }}
          >✕</button>
        )}
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          className={`ftab ${catFilter === 'all' ? 'active' : ''}`}
          onClick={() => onCatFilter('all')}
        >All</button>
        {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([key, cfg]) => (
          <button
            key={key}
            className={`ftab ${catFilter === key ? 'active' : ''}`}
            onClick={() => onCatFilter(catFilter === key ? 'all' : key)}
          >
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>

      {/* Sort + Priority + Bulk actions row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={sortBy}
          onChange={e => onSortBy(e.target.value as SortBy)}
          className="u-input"
          style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}
        >
          <option value="created">⏰ Newest first</option>
          <option value="priority">🔥 By priority</option>
          <option value="dueDate">📅 By due date</option>
          <option value="name">🔤 Alphabetical</option>
          <option value="status">✅ By status</option>
        </select>

        <select
          value={priFilter}
          onChange={e => onPriFilter(e.target.value as Priority | 'all')}
          className="u-input"
          style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}
        >
          <option value="all">All priorities</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {totalCount > 0 && (
            <button className="btn-ghost" onClick={onMarkAllDone}>✅ All done</button>
          )}
          {completedCount > 0 && (
            <button className="btn-ghost" onClick={onDeleteCompleted}>
              🗑️ Clear {completedCount} done
            </button>
          )}
          {totalCount > 0 && (
            <button
              className="btn-ghost danger"
              onClick={() => {
                if (window.confirm('Delete ALL tasks? This cannot be undone.')) onClearAll()
              }}
            >☠️ Clear all</button>
          )}
        </div>
      </div>

    </div>
  )
}

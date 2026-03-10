import { useRef, useEffect } from 'react'
import { useTodos } from '../hooks/useTodos'
import { launchConfetti } from '../utils/confetti'
import StatsBar from './StatsBar'
import FilterBar from './FilterBar'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem'

export default function TodoList() {
  const ctx      = useTodos()
  const inputRef = useRef<HTMLInputElement>(null)
  const prevPct  = useRef(0)

  /* ── Sync dark/light class on <html> ──────────────────── */
  useEffect(() => {
    document.documentElement.classList.toggle('light', !ctx.dark)
  }, [ctx.dark])

  /* ── Ctrl+N → focus the add-task input ────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  /* ── Confetti on 100 % completion ─────────────────────── */
  useEffect(() => {
    if (ctx.stats.total > 0 && ctx.stats.pct === 100 && prevPct.current < 100) {
      launchConfetti()
    }
    prevPct.current = ctx.stats.pct
  }, [ctx.stats.pct, ctx.stats.total])

  return (
    <div className="app-bg">
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* ── Header ── */}
        <div className="gradient-bar" style={{ borderRadius: '0 0 28px 28px', padding: '28px 24px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

            {/* Left: keyboard hint */}
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', paddingTop: 4 }}>
              <kbd style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3, padding: '1px 4px', color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                Ctrl+N
              </kbd>
              {' '}new task
            </div>

            {/* Center: title */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.1 }}>
                ✨ UltraTodo
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '4px 0 0' }}>
                Your supercharged task manager
              </p>
            </div>

            {/* Right: theme toggle */}
            <button
              onClick={() => ctx.setDark(!ctx.dark)}
              style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                width: 38, height: 38, cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              title="Toggle light / dark"
            >
              {ctx.dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {ctx.stats.total > 0 && (
          <div className="glass rounded-2xl" style={{ padding: 16, marginBottom: 14 }}>
            <StatsBar stats={ctx.stats} status={ctx.status} onStatus={ctx.setStatus} />
          </div>
        )}

        {/* ── Add Task Form ── */}
        <div style={{ marginBottom: 14 }}>
          <TodoForm onAdd={ctx.add} inputRef={inputRef} />
        </div>

        {/* ── Filters (only when there are tasks) ── */}
        {ctx.stats.total > 0 && (
          <div className="glass rounded-2xl" style={{ padding: 16, marginBottom: 14 }}>
            <FilterBar
              search={ctx.search}         onSearch={ctx.setSearch}
              catFilter={ctx.catFilter}   onCatFilter={ctx.setCatFilter}
              priFilter={ctx.priFilter}   onPriFilter={ctx.setPriFilter}
              sortBy={ctx.sortBy}         onSortBy={ctx.setSortBy}
              completedCount={ctx.stats.completed}
              totalCount={ctx.stats.total}
              onDeleteCompleted={ctx.deleteCompleted}
              onMarkAllDone={ctx.markAllDone}
              onClearAll={ctx.clearAll}
            />
          </div>
        )}

        {/* ── Todo list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ctx.todos.length === 0 ? (
            <div className="empty-state animate-float">
              <div style={{ fontSize: 56, marginBottom: 14 }}>
                {ctx.stats.total === 0 ? '🚀' : '🔍'}
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-sub)', margin: '0 0 8px' }}>
                {ctx.stats.total === 0 ? 'No tasks yet!' : 'No matching tasks'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                {ctx.stats.total === 0
                  ? 'Add your first task above to get started 👆'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            ctx.todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={ctx.toggle}
                onRemove={ctx.remove}
                onUpdate={ctx.update}
                onStar={ctx.star}
                onAddSubtask={ctx.addSubtask}
                onToggleSubtask={ctx.toggleSubtask}
                onRemoveSubtask={ctx.removeSubtask}
                isOverdue={ctx.isOverdue}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {ctx.stats.total > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 28 }}>
            {ctx.stats.completed} of {ctx.stats.total} tasks completed
            {ctx.stats.pct === 100 && ' 🎉 All done!'}
            {' · '}
            <kbd>Ctrl+N</kbd> new task
          </p>
        )}

      </div>
    </div>
  )
}

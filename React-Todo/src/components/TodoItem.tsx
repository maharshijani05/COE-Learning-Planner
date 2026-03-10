import { useState, useCallback } from 'react'
import type { Todo, Priority, Category } from '../types/todo'
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../types/todo'

interface Props {
  todo: Todo
  onToggle: (id: number) => void
  onRemove: (id: number) => void
  onUpdate: (id: number, patch: Partial<Todo>) => void
  onStar: (id: number) => void
  onAddSubtask: (todoId: number, text: string) => void
  onToggleSubtask: (todoId: number, stId: number) => void
  onRemoveSubtask: (todoId: number, stId: number) => void
  isOverdue: (t: Todo) => boolean
}

function formatDue(dateStr: string): { label: string; red: boolean } {
  const d     = new Date(dateStr + 'T00:00:00')
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due   = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff  = Math.round((due.getTime() - today.getTime()) / 86400000)

  let label: string
  if      (diff === 0)             label = 'Today'
  else if (diff === 1)             label = 'Tomorrow'
  else if (diff === -1)            label = 'Yesterday'
  else if (diff > 1 && diff < 7)  label = `In ${diff}d`
  else if (diff < -1)              label = `${Math.abs(diff)}d ago`
  else                             label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return { label, red: diff < 0 }
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function TodoItem({
  todo, onToggle, onRemove, onUpdate, onStar,
  onAddSubtask, onToggleSubtask, onRemoveSubtask, isOverdue,
}: Props) {
  const [editing,       setEditing]       = useState(false)
  const [editText,      setEditText]      = useState(todo.text)
  const [editNotes,     setEditNotes]     = useState(todo.notes)
  const [editPri,       setEditPri]       = useState<Priority>(todo.priority)
  const [editCat,       setEditCat]       = useState<Category>(todo.category)
  const [editDue,       setEditDue]       = useState(todo.dueDate ?? '')
  const [showExtra,     setShowExtra]     = useState(false)
  const [subtaskInput,  setSubtaskInput]  = useState('')
  const [starPop,       setStarPop]       = useState(false)

  const pri        = PRIORITY_CONFIG[todo.priority]
  const cat        = CATEGORY_CONFIG[todo.category]
  const overdueFlag = isOverdue(todo)
  const donePct    = todo.subtasks.length
    ? Math.round((todo.subtasks.filter(s => s.completed).length / todo.subtasks.length) * 100)
    : 0

  const startEdit = useCallback(() => {
    setEditText(todo.text); setEditNotes(todo.notes)
    setEditPri(todo.priority); setEditCat(todo.category)
    setEditDue(todo.dueDate ?? ''); setEditing(true)
  }, [todo])

  const saveEdit = useCallback(() => {
    if (!editText.trim()) return
    onUpdate(todo.id, {
      text: editText.trim(), notes: editNotes,
      priority: editPri, category: editCat,
      dueDate: editDue || null,
    })
    setEditing(false)
  }, [editText, editNotes, editPri, editCat, editDue, todo.id, onUpdate])

  const cancelEdit = useCallback(() => setEditing(false), [])

  const handleStar = useCallback(() => {
    setStarPop(true)
    onStar(todo.id)
    setTimeout(() => setStarPop(false), 400)
  }, [onStar, todo.id])

  const addSubtask = useCallback(() => {
    if (!subtaskInput.trim()) return
    onAddSubtask(todo.id, subtaskInput)
    setSubtaskInput('')
  }, [subtaskInput, todo.id, onAddSubtask])

  return (
    <div className={`glass rounded-xl overflow-hidden animate-in pri-${todo.priority} ${overdueFlag ? 'overdue-pulse' : ''}`}>

      {editing ? (
        /* ─── Edit mode ──────────────────────────────────────── */
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            className="u-input"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
          />

          {/* Priority */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Priority:</span>
            {(Object.entries(PRIORITY_CONFIG) as [Priority, { label: string; color: string; bg: string }][]).map(([key, cfg]) => (
              <button
                key={key} type="button"
                onClick={() => setEditPri(key)}
                style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${editPri === key ? cfg.color : 'var(--border)'}`,
                  background: editPri === key ? cfg.bg : 'transparent',
                  color: editPri === key ? cfg.color : 'var(--text-sub)',
                }}
              >{cfg.label}</button>
            ))}
          </div>

          {/* Category + Due */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={editCat}
              onChange={e => setEditCat(e.target.value as Category)}
              className="u-input"
              style={{ width: 'auto', padding: '5px 10px', fontSize: 13 }}
            >
              {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.emoji} {cfg.label}</option>
              ))}
            </select>
            <input
              type="date"
              value={editDue}
              onChange={e => setEditDue(e.target.value)}
              className="u-input"
              style={{ width: 'auto', padding: '5px 10px', fontSize: 13, colorScheme: 'dark' }}
              min={todayStr()}
            />
          </div>

          {/* Notes */}
          <textarea
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            placeholder="Notes..."
            rows={2}
            className="u-input"
            style={{ resize: 'vertical', fontSize: 13 }}
          />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={cancelEdit} className="btn-ghost">Cancel</button>
            <button type="button" onClick={saveEdit} className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>
              Save
            </button>
          </div>
        </div>

      ) : (
        /* ─── View mode ──────────────────────────────────────── */
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Main row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>

            {/* Checkbox */}
            <div
              className={`check-circle ${todo.completed ? 'checked' : ''}`}
              onClick={() => onToggle(todo.id)}
              role="checkbox"
              aria-checked={todo.completed}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onToggle(todo.id)}
              style={{ marginTop: 2 }}
            />

            {/* Text + tags */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 15, fontWeight: 500, lineHeight: 1.4, wordBreak: 'break-word',
                color: todo.completed ? 'var(--text-muted)' : 'var(--text)',
                textDecoration: todo.completed ? 'line-through' : 'none',
                margin: 0, transition: 'color 0.2s',
              }}>
                {todo.text}
              </p>

              {/* Badge row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, alignItems: 'center' }}>

                {/* Category */}
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 10,
                  background: 'var(--surface-in)', border: '1px solid var(--border)',
                  color: 'var(--text-sub)',
                }}>
                  {cat.emoji} {cat.label}
                </span>

                {/* Priority */}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: pri.bg, color: pri.color,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {pri.label}
                </span>

                {/* Due date */}
                {todo.dueDate && (() => {
                  const { label, red } = formatDue(todo.dueDate)
                  const warn = red && !todo.completed
                  return (
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: warn ? 'rgba(239,68,68,0.15)' : 'var(--surface-in)',
                      color: warn ? '#f87171' : 'var(--text-sub)',
                      border: `1px solid ${warn ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                    }}>
                      📅 {label}
                    </span>
                  )
                })()}

                {/* Subtask count */}
                {todo.subtasks.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length} subtasks
                  </span>
                )}

                {/* Completed date */}
                {todo.completedAt && (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    ✓ {new Date(todo.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Subtask progress bar */}
              {todo.subtasks.length > 0 && (
                <div className="prog-track" style={{ marginTop: 6 }}>
                  <div className="prog-fill" style={{ width: `${donePct}%` }} />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <button
                className={`btn-icon ${starPop ? 'star-popping' : ''}`}
                onClick={handleStar}
                title={todo.starred ? 'Unstar' : 'Star'}
                style={{ color: todo.starred ? '#f59e0b' : 'var(--text-muted)' }}
              >
                {todo.starred ? '⭐' : '☆'}
              </button>

              <button
                className="btn-icon"
                onClick={() => setShowExtra(v => !v)}
                title={showExtra ? 'Collapse' : 'Expand'}
                style={{ fontSize: 12 }}
              >
                {showExtra ? '▲' : '▼'}
              </button>

              <button className="btn-icon" onClick={startEdit} title="Edit">✏️</button>
              <button
                className="btn-icon"
                onClick={() => onRemove(todo.id)}
                title="Delete"
                style={{ color: '#f87171' }}
              >🗑️</button>
            </div>

          </div>

          {/* Expanded section */}
          {showExtra && (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 32 }}>

              {/* Notes */}
              {todo.notes && (
                <div className="note-box">{todo.notes}</div>
              )}

              {/* Subtasks */}
              {todo.subtasks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {todo.subtasks.map(st => (
                    <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        className={`check-circle ${st.completed ? 'checked' : ''}`}
                        onClick={() => onToggleSubtask(todo.id, st.id)}
                        role="checkbox"
                        aria-checked={st.completed}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && onToggleSubtask(todo.id, st.id)}
                        style={{ width: 16, height: 16, fontSize: 10 }}
                      />
                      <span style={{
                        fontSize: 13, flex: 1,
                        color: st.completed ? 'var(--text-muted)' : 'var(--text-sub)',
                        textDecoration: st.completed ? 'line-through' : 'none',
                      }}>{st.text}</span>
                      <button
                        className="btn-icon"
                        onClick={() => onRemoveSubtask(todo.id, st.id)}
                        style={{ width: 18, height: 18, fontSize: 11 }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add subtask */}
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={e => setSubtaskInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                  placeholder="Add a subtask... (Enter)"
                  className="u-input"
                  style={{ fontSize: 13, padding: '5px 10px' }}
                />
                <button type="button" onClick={addSubtask} className="btn-ghost" style={{ flexShrink: 0 }}>
                  + Add
                </button>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  )
}

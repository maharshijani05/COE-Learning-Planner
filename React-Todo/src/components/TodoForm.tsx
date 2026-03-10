import { useState, useCallback, useEffect, useRef, type FormEvent, type RefObject } from 'react'
import type { Category, Priority } from '../types/todo'
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../types/todo'

interface TodoFormProps {
  onAdd: (text: string, priority: Priority, category: Category, dueDate: string | null, notes: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function TodoForm({ onAdd, inputRef }: TodoFormProps) {
  const [expanded,  setExpanded]  = useState(false)
  const [text,      setText]      = useState('')
  const [priority,  setPriority]  = useState<Priority>('medium')
  const [category,  setCategory]  = useState<Category>('personal')
  const [dueDate,   setDueDate]   = useState('')
  const [notes,     setNotes]     = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const reset = useCallback(() => {
    setText(''); setPriority('medium'); setCategory('personal')
    setDueDate(''); setNotes(''); setShowNotes(false); setExpanded(false)
  }, [])

  const submit = useCallback((e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      wrapRef.current?.classList.add('animate-shake')
      setTimeout(() => wrapRef.current?.classList.remove('animate-shake'), 400)
      return
    }
    onAdd(text, priority, category, dueDate || null, notes)
    reset()
  }, [text, priority, category, dueDate, notes, onAdd, reset])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) { reset(); return }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && expanded && text.trim()) {
        e.preventDefault()
        onAdd(text, priority, category, dueDate || null, notes)
        reset()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [expanded, text, priority, category, dueDate, notes, onAdd, reset])

  return (
    <div ref={wrapRef}>
      <form onSubmit={submit} className="glass rounded-2xl overflow-hidden">

        {/* Main input row */}
        <div style={{ display: 'flex', gap: 8, padding: 12 }}>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => { setText(e.target.value); if (e.target.value && !expanded) setExpanded(true) }}
            onFocus={() => setExpanded(true)}
            placeholder="✨ What needs to be done? (Ctrl+N to focus)"
            className="u-input"
            style={{ border: 'none', background: 'transparent', fontSize: 15, flex: 1 }}
          />
          <button type="submit" className="btn-primary">+ Add Task</button>
        </div>

        {/* Expanded options */}
        {expanded && (
          <div
            className="animate-in"
            style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border)' }}
          >

            {/* Priority selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', paddingTop: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>Priority:</span>
              {(Object.entries(PRIORITY_CONFIG) as [Priority, { label: string; color: string; bg: string }][]).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  style={{
                    padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${priority === key ? cfg.color : 'var(--border)'}`,
                    background: priority === key ? cfg.bg : 'transparent',
                    color: priority === key ? cfg.color : 'var(--text-sub)',
                    transition: 'all 0.15s',
                  }}
                >{cfg.label}</button>
              ))}
            </div>

            {/* Category + Due Date row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>Category:</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="u-input"
                style={{ width: 'auto', padding: '5px 10px', fontSize: 13 }}
              >
                {(Object.entries(CATEGORY_CONFIG) as [Category, { label: string; emoji: string }][]).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.emoji} {cfg.label}</option>
                ))}
              </select>

              <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>Due:</span>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="u-input"
                style={{ width: 'auto', padding: '5px 10px', fontSize: 13, colorScheme: 'dark' }}
                min={todayStr()}
              />

              <button
                type="button"
                onClick={() => setShowNotes(v => !v)}
                className="btn-ghost"
                style={{ marginLeft: 'auto' }}
              >
                {showNotes ? '🙈 Hide notes' : '📝 Add notes'}
              </button>
            </div>

            {/* Notes textarea */}
            {showNotes && (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes or description..."
                rows={2}
                className="u-input animate-in"
                style={{ resize: 'vertical', fontSize: 13 }}
              />
            )}

            {/* Footer row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <kbd>Ctrl+Enter</kbd> submit · <kbd>Esc</kbd> cancel
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={reset} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>
                  Add Task
                </button>
              </div>
            </div>

          </div>
        )}

      </form>
    </div>
  )
}

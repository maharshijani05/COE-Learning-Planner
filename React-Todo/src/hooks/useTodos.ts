import { useState, useCallback, useMemo } from 'react'
import type { Todo, Priority, Category, FilterStatus, SortBy } from '../types/todo'

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function useLS<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : init
    } catch {
      return init
    }
  })

  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setVal(prev => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
        try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* noop */ }
        return next
      })
    },
    [key],
  )

  return [val, set]
}

export function useTodos() {
  const [todos, setTodos]   = useLS<Todo[]>('ultratodo-v1', [])
  const [dark,  setDark]    = useLS<boolean>('ultratodo-dark', true)
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState<FilterStatus>('all')
  const [catFilter,  setCatFilter]  = useState<Category | 'all'>('all')
  const [priFilter,  setPriFilter]  = useState<Priority | 'all'>('all')
  const [sortBy,     setSortBy]     = useState<SortBy>('created')

  const isOverdue = useCallback((t: Todo) => {
    if (t.completed || !t.dueDate) return false
    const d = new Date()
    const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    return t.dueDate < todayStr
  }, [])

  /* ── CRUD ─────────────────────────────────────────────── */

  const add = useCallback((
    text: string,
    priority: Priority = 'medium',
    category: Category = 'personal',
    dueDate: string | null = null,
    notes = '',
  ) => {
    if (!text.trim()) return
    setTodos(prev => [{
      id: Date.now(), text: text.trim(), completed: false,
      priority, category, dueDate, notes,
      subtasks: [], createdAt: Date.now(), completedAt: null, starred: false,
    }, ...prev])
  }, [setTodos])

  const toggle = useCallback((id: number) =>
    setTodos(prev => prev.map(t =>
      t.id !== id ? t : { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null }
    )), [setTodos])

  const remove = useCallback((id: number) =>
    setTodos(prev => prev.filter(t => t.id !== id)), [setTodos])

  const update = useCallback((id: number, patch: Partial<Todo>) =>
    setTodos(prev => prev.map(t => t.id !== id ? t : { ...t, ...patch })), [setTodos])

  const star = useCallback((id: number) =>
    setTodos(prev => prev.map(t => t.id !== id ? t : { ...t, starred: !t.starred })), [setTodos])

  /* ── Subtasks ─────────────────────────────────────────── */

  const addSubtask = useCallback((todoId: number, text: string) => {
    if (!text.trim()) return
    setTodos(prev => prev.map(t =>
      t.id !== todoId ? t : {
        ...t,
        subtasks: [...t.subtasks, { id: Date.now(), text: text.trim(), completed: false }],
      }
    ))
  }, [setTodos])

  const toggleSubtask = useCallback((todoId: number, stId: number) =>
    setTodos(prev => prev.map(t =>
      t.id !== todoId ? t : {
        ...t,
        subtasks: t.subtasks.map(s => s.id !== stId ? s : { ...s, completed: !s.completed }),
      }
    )), [setTodos])

  const removeSubtask = useCallback((todoId: number, stId: number) =>
    setTodos(prev => prev.map(t =>
      t.id !== todoId ? t : { ...t, subtasks: t.subtasks.filter(s => s.id !== stId) }
    )), [setTodos])

  /* ── Bulk actions ─────────────────────────────────────── */

  const deleteCompleted = useCallback(() =>
    setTodos(prev => prev.filter(t => !t.completed)), [setTodos])

  const markAllDone = useCallback(() =>
    setTodos(prev => prev.map(t => ({
      ...t, completed: true, completedAt: t.completedAt ?? Date.now(),
    }))), [setTodos])

  const clearAll = useCallback(() => setTodos([]), [setTodos])

  /* ── Derived ──────────────────────────────────────────── */

  const filtered = useMemo(() =>
    todos
      .filter(t => {
        if (status === 'active')    return !t.completed
        if (status === 'completed') return t.completed
        if (status === 'overdue')   return isOverdue(t)
        if (status === 'starred')   return t.starred
        return true
      })
      .filter(t => catFilter === 'all' || t.category === catFilter)
      .filter(t => priFilter === 'all' || t.priority === priFilter)
      .filter(t => !search ||
        t.text.toLowerCase().includes(search.toLowerCase()) ||
        t.notes.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (sortBy === 'name')     return a.text.localeCompare(b.text)
        if (sortBy === 'status')   return Number(a.completed) - Number(b.completed)
        if (sortBy === 'dueDate') {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate < b.dueDate ? -1 : 1
        }
        return b.createdAt - a.createdAt
      }),
    [todos, status, catFilter, priFilter, search, sortBy, isOverdue]
  )

  const stats = useMemo(() => {
    const total     = todos.length
    const completed = todos.filter(t => t.completed).length
    return {
      total,
      completed,
      active:  todos.filter(t => !t.completed).length,
      overdue: todos.filter(t => isOverdue(t)).length,
      starred: todos.filter(t => t.starred).length,
      pct:     total ? Math.round((completed / total) * 100) : 0,
    }
  }, [todos, isOverdue])

  return {
    todos: filtered,
    stats,
    dark, setDark,
    search, setSearch,
    status, setStatus,
    catFilter, setCatFilter,
    priFilter, setPriFilter,
    sortBy, setSortBy,
    add, toggle, remove, update, star,
    addSubtask, toggleSubtask, removeSubtask,
    deleteCompleted, markAllDone, clearAll,
    isOverdue,
  }
}

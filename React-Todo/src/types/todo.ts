export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'learning' | 'other'
export type FilterStatus = 'all' | 'active' | 'completed' | 'overdue' | 'starred'
export type SortBy = 'created' | 'dueDate' | 'priority' | 'name' | 'status'

export interface SubTask {
  id: number
  text: string
  completed: boolean
}

export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: Priority
  category: Category
  dueDate: string | null
  notes: string
  subtasks: SubTask[]
  createdAt: number
  completedAt: number | null
  starred: boolean
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  low:      { label: 'Low',      color: '#22c55e', bg: 'rgba(34,197,94,0.15)'  },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  high:     { label: 'High',     color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.15)'  },
}

export const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string }> = {
  personal: { label: 'Personal', emoji: '👤' },
  work:     { label: 'Work',     emoji: '💼' },
  shopping: { label: 'Shopping', emoji: '🛒' },
  health:   { label: 'Health',   emoji: '❤️'  },
  learning: { label: 'Learning', emoji: '📚' },
  other:    { label: 'Other',    emoji: '📌' },
}

import { type ChangeEvent, type SubmitEvent, useState } from "react"
import type { Todo } from "../types/todo"

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [input, setInput] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editText, setEditText] = useState("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const addTodo = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!input.trim()) return

        const newTodo: Todo = {
            id: Date.now(),
            text: input,
            completed: false,
        }

        setTodos(prev => [...prev, newTodo])
        setInput("")
    }

    const toggleTodo = (id: number) => {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        )
    }

    const deleteTodo = (id: number) => {
        setTodos(prev => prev.filter(todo => todo.id !== id))
    }

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id)
        setEditText(todo.text)
    }

    const saveEdit = (id: number) => {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id
                    ? { ...todo, text: editText }
                    : todo
            )
        )

        setEditingId(null)
        setEditText("")
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>

            <form onSubmit={addTodo} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    placeholder="Add a task..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                    Add
                </button>
            </form>

            <ul className="space-y-2">
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                        <div className="flex items-center gap-3 flex-1">

                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="w-4 h-4 cursor-pointer"
                            />

                            {editingId === todo.id ? (
                                <input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            ) : (
                                <span
                                    className={
                                        todo.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }
                                >
                  {todo.text}
                </span>
                            )}
                        </div>

                        {editingId === todo.id ? (
                            <button
                                onClick={() => saveEdit(todo.id)}
                                className="text-green-500 ml-3 hover:text-green-700 cursor-pointer"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => startEdit(todo)}
                                className="text-blue-500 hover:text-blue-800 cursor-pointer ml-3"
                            >
                                Edit
                            </button>
                        )}

                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer ml-3"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
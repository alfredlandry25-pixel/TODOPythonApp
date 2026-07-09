import { useEffect, useMemo, useState } from 'react'
import './App.css'

const storageKey = 'taskflow.tasks'

const starterTasks = [
  {
    id: 1,
    title: 'Sketch the dashboard layout',
    priority: 'High',
    completed: false,
  },
  {
    id: 2,
    title: 'Review weekly goals',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 3,
    title: 'Archive finished notes',
    priority: 'Low',
    completed: true,
  },
]

const filters = ['All', 'Active', 'Done']
const priorities = ['Low', 'Medium', 'High']

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey)
    return savedTasks ? JSON.parse(savedTasks) : starterTasks
  } catch {
    return starterTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [taskTitle, setTaskTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => {
    if (filter === 'Active') {
      return tasks.filter((task) => !task.completed)
    }

    if (filter === 'Done') {
      return tasks.filter((task) => task.completed)
    }

    return tasks
  }, [filter, tasks])

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  function addTask(event) {
    event.preventDefault()

    const trimmedTitle = taskTitle.trim()
    if (!trimmedTitle) return

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title: trimmedTitle,
        priority,
        completed: false,
      },
      ...currentTasks,
    ])
    setTaskTitle('')
    setPriority('Medium')
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="Task manager">
        <header className="app-header">
          <div>
            <span className="eyebrow">Today</span>
            <h1>TaskFlow</h1>
          </div>
          <div
            className="progress-ring"
            style={{ '--progress': `${progress}%` }}
            aria-label={`${progress}% complete`}
          >
            <span>{progress}%</span>
          </div>
        </header>

        <section className="summary-grid" aria-label="Task summary">
          <div className="summary-tile">
            <span>{tasks.length}</span>
            <p>Total</p>
          </div>
          <div className="summary-tile">
            <span>{activeCount}</span>
            <p>Active</p>
          </div>
          <div className="summary-tile">
            <span>{completedCount}</span>
            <p>Done</p>
          </div>
        </section>

        <form className="task-form" onSubmit={addTask}>
          <label className="task-input-label" htmlFor="task-title">
            New task
          </label>
          <div className="task-input-row">
            <input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Add something worth finishing"
            />
            <select
              aria-label="Task priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {priorities.map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>
                  {priorityOption}
                </option>
              ))}
            </select>
            <button type="submit">Add</button>
          </div>
        </form>

        <div className="toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Task filters">
            {filters.map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                className={filter === filterOption ? 'active' : ''}
                onClick={() => setFilter(filterOption)}
              >
                {filterOption}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="clear-button"
            disabled={completedCount === 0}
            onClick={clearCompleted}
          >
            Clear done
          </button>
        </div>

        <section className="task-list" aria-live="polite">
          {visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <article
                className={`task-item ${task.completed ? 'completed' : ''}`}
                key={task.id}
              >
                <button
                  type="button"
                  className="check-button"
                  aria-label={task.completed ? 'Mark as active' : 'Mark as done'}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? '✓' : ''}
                </button>
                <div className="task-copy">
                  <h2>{task.title}</h2>
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => deleteTask(task.id)}
                >
                  ×
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h2>No tasks here</h2>
              <p>Switch filters or add a new task to keep the day moving.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App

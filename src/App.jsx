import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PasscodeGate from './components/PasscodeGate';

function App() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const auth = sessionStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticated = () => {
    sessionStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    setIsAuthenticated(false);
  };

  const handleToggleTask = async (dateKey, taskId) => {
    // 1. Update local state immediately
    const currentDayTasks = tasks[dateKey] || {
      task1: false, task2: false, task3: false, task4: false,
      task5: false, task6: false, task7: false
    };

    const updatedDayTasks = {
      ...currentDayTasks,
      [taskId]: !currentDayTasks[taskId]
    };

    const newTasks = {
      ...tasks,
      [dateKey]: updatedDayTasks
    };

    setTasks(newTasks);

    // 2. Sync to Server
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTasks),
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 text-slate-500">
        로딩 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Work Log</h1>
        </header>
        <PasscodeGate onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start p-6 bg-slate-100">
      <header className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Work Log</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
        >
          잠금
        </button>
      </header>

      <main className="w-full max-w-6xl flex-1 min-h-0 mb-4">
        <Calendar tasks={tasks} onToggleTask={handleToggleTask} />
      </main>
    </div>
  );
}

export default App;

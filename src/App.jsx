import React, { useState } from 'react';
import Calendar from './components/Calendar';

function App() {
  // State to store task completion status
  // Key: 'yyyy-MM-dd'
  // Value: { task1: boolean, task2: boolean }
  const [tasks, setTasks] = useState({});

  const handleToggleTask = (dateKey, taskId) => {
    setTasks(prev => {
      const dayTasks = prev[dateKey] || { task1: false, task2: false };
      return {
        ...prev,
        [dateKey]: {
          ...dayTasks,
          [taskId]: !dayTasks[taskId]
        }
      };
    });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start p-6">
      <header className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Work Log</h1>
      </header>

      <main className="w-full max-w-6xl flex-1 min-h-0 mb-4">
        <Calendar tasks={tasks} onToggleTask={handleToggleTask} />
      </main>
    </div>
  );
}

export default App;

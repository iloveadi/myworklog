import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PasscodeGate from './components/PasscodeGate';
import { supabase } from './supabaseClient';

function App() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Check local passcode session
    const auth = sessionStorage.getItem('passcode_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      initializeSupabase();
    } else {
      setLoading(false); // Show login screen immediately
    }
  }, []);

  const initializeSupabase = async () => {
    setLoading(true);
    // 2. Background Login to Supabase
    // Using hardcoded credentials to map "1212" to a real DB user
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: 'admin@myworklog.com',
      password: 'password1212',
    });

    if (error) {
      console.error("Supabase Login Error:", error);
      // If login fails (e.g. invalid credentials or network), we might fallback or retry
      // For now, let's try to fetch tasks anyway in case session exists or RLS is open
    }

    if (session) {
      setSession(session);
      fetchTasks(session.user.id);
    } else {
      // Fallback: Try getting existing session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        setSession(existingSession);
        fetchTasks(existingSession.user.id);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('date_key, tasks')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const loadedTasks = {};
        data.forEach(item => {
          loadedTasks[item.date_key] = item.tasks;
        });
        setTasks(loadedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticated = () => {
    sessionStorage.setItem('passcode_auth', 'true');
    setIsAuthenticated(true);
    initializeSupabase();
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('passcode_auth');
    setIsAuthenticated(false);
    setSession(null);
    setTasks({});
    await supabase.auth.signOut();
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

    setTasks(prev => ({
      ...prev,
      [dateKey]: updatedDayTasks
    }));

    // 2. Sync to Supabase
    if (session) {
      const { error } = await supabase
        .from('user_tasks')
        .upsert({
          user_id: session.user.id,
          date_key: dateKey,
          tasks: updatedDayTasks
        }, { onConflict: 'user_id, date_key' });

      if (error) {
        console.error('Error saving task:', error);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 text-slate-500">
        로딩 중...
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

import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PasscodeGate from './components/PasscodeGate';
import { supabase } from './supabaseClient';

function App() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);
  const [saveStatus, setSaveStatus] = useState(''); // 'saved', 'saving', 'error'

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
    const email = 'admin@myworklog.com';
    const password = 'password1212';

    // 2. Background Login to Supabase
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error && error.message.includes('Invalid login credentials')) {
      // Fallback: Try to SignUp if user doesn't exist
      console.log("Login failed, attempting signup...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!signUpError && signUpData.session) {
        data = signUpData; // Use signup session
      } else if (signUpError) {
        console.error("Signup Error:", signUpError);
      }
    }

    if (data?.session) {
      setSession(data.session);
      fetchTasks(data.session.user.id);
    } else {
      // Final Fallback: Check if there's an existing session from before
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
      setSaveStatus('saving');
      const { error } = await supabase
        .from('user_tasks')
        .upsert({
          user_id: session.user.id,
          date_key: dateKey,
          tasks: updatedDayTasks
        }, { onConflict: 'user_id, date_key' });

      if (error) {
        console.error('Error saving task:', error);
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
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

      {/* Debug/Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        {saveStatus === 'saving' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold shadow-sm">저장 중...</span>}
        {saveStatus === 'saved' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm">저장 완료</span>}
        {saveStatus === 'error' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold shadow-sm">저장 실패 (네트워크/설정 확인)</span>}
        {!session && isAuthenticated && !loading && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold shadow-sm">오프라인 (저장 안됨)</span>}
      </div>

      <main className="w-full max-w-6xl flex-1 min-h-0 mb-4">
        <Calendar tasks={tasks} onToggleTask={handleToggleTask} />
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CalendarDay = ({ day, currentMonth, tasks, onToggleTask }) => {
  const dateKey = format(day, 'yyyy-MM-dd');
  const dayTasks = tasks[dateKey] || {
    task1: false, task2: false, task3: false, task4: false,
    task5: false, task6: false, task7: false, task8: false, task9: false
  };

  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isDayToday = isToday(day);

  // Helper for rendering a task item
  const renderTask = (id, label, activeBgClass, activeTextClass) => {
    const isActive = dayTasks[id];
    return (
      <button
        onClick={() => onToggleTask(dateKey, id)}
        className={cn(
          "group relative flex items-center justify-center px-1 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-200 overflow-hidden min-w-0 flex-1",
          isActive
            ? cn(activeBgClass, activeTextClass, "shadow-sm ring-1 ring-black/10")
            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
        )}
      >
        <span className="truncate w-full text-center">{label}</span>
      </button>
    );
  };

  return (
    <div className={cn(
      "min-h-full p-2 flex flex-col gap-1.5 transition-all duration-300 border-b border-white/5 border-r",
      !isCurrentMonth ? "bg-black/40 opacity-50" : "hover:bg-white/5",
      isDayToday && "bg-blue-900/10 shadow-inner"
    )}>
      <div className="flex justify-between items-start mb-1 px-1">
        <span className={cn(
          "text-base font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
          !isCurrentMonth ? "text-slate-700" : "text-slate-300",
          isDayToday && "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
        )}>
          {format(day, 'd')}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {/* Row 1: Youtube/Red Theme */}
        <div className="grid grid-cols-4 gap-1">
          {renderTask('task1', '수면', 'bg-red-600', 'text-white')}
          {renderTask('task8', '낮친', 'bg-red-600', 'text-white')}
          {renderTask('task9', '트뿜', 'bg-red-600', 'text-white')}
        </div>

        {/* Row 2: Blog/Blue Theme */}
        <div className="grid grid-cols-4 gap-1">
          {renderTask('task4', '마음', 'bg-blue-600', 'text-white')}
          {renderTask('task3', '나허', 'bg-blue-600', 'text-white')}
          {renderTask('task2', '인북', 'bg-blue-600', 'text-white')}
          {renderTask('task5', '쉼표', 'bg-blue-600', 'text-white')}
        </div>

        {/* Row 3: Green Theme */}
        <div className="grid grid-cols-4 gap-1">
          {renderTask('task7', '네폐', 'bg-emerald-600', 'text-white')}
          {renderTask('task6', '티폐', 'bg-emerald-600', 'text-white')}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;

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
    task5: false, task6: false, task7: false
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
          "group relative flex items-center w-full px-2 py-1 rounded-md text-xs font-bold transition-all duration-200",
          isActive
            ? cn(activeBgClass, activeTextClass, "shadow-sm ring-1 ring-black/5")
            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
        )}
      >
        <span className={cn(
          "w-2 h-2 rounded-full mr-2 shrink-0 transition-colors",
          isActive ? "bg-current" : "bg-neutral-600 group-hover:bg-neutral-500"
        )} />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <div className={cn(
      "min-h-full p-2 flex flex-col gap-0.5 transition-all duration-300 border-b border-white/5 border-r",
      !isCurrentMonth ? "bg-black/40 opacity-50" : "hover:bg-white/5",
      isDayToday && "bg-blue-900/10 shadow-inner"
    )}>
      <div className="flex justify-between items-start mb-2 px-1">
        <span className={cn(
          "text-base font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors",
          !isCurrentMonth ? "text-slate-700" : "text-slate-300",
          isDayToday && "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
        )}>
          {format(day, 'd')}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {renderTask('task1', '수면 유도 음악실', 'bg-[#E0E7FF]', 'text-[#3730A3]')}
        {renderTask('task2', '인사이트 북스', 'bg-[#D1FAE5]', 'text-[#065F46]')}
        {renderTask('task3', 'narrhub', 'bg-[#EDE9FE]', 'text-[#5B21B6]')}
        {renderTask('task4', '마음 산책', 'bg-[#FFE4E6]', 'text-[#9F1239]')}
        {renderTask('task5', '쉼표가 필요한 시간', 'bg-[#FEF3C7]', 'text-[#92400E]')}
        {renderTask('task6', '네이버PM', 'bg-[#ECFCCB]', 'text-[#3F6212]')}
        {renderTask('task7', '티스토리PM', 'bg-[#FFEDD5]', 'text-[#9A3412]')}
      </div>
    </div>
  );
};

export default CalendarDay;

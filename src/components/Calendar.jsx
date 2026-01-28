import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';

const Calendar = ({ tasks, onToggleTask }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleResetToday = () => setCurrentMonth(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // Calculate Naver PM count for the current month
    const naverPmCount = calendarDays.filter(day => {
        if (!isSameMonth(day, currentMonth)) return false;
        const dateKey = format(day, 'yyyy-MM-dd');
        return tasks[dateKey]?.task7 === true;
    }).length;

    return (
        <div className="flex flex-col h-full bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-800 bg-neutral-900">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {format(currentMonth, 'yyyy년 M월', { locale: ko })} ({naverPmCount})
                    </h2>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition-colors"
                            aria-label="Previous Month"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition-colors"
                            aria-label="Next Month"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>


            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900">
                {weekDays.map((day) => (
                    <div key={day} className="py-3 text-center text-sm font-bold text-slate-200 uppercase tracking-wider drop-shadow-sm">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-neutral-900">
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)]">
                    {calendarDays.map((day) => (
                        <CalendarDay
                            key={day.toISOString()}
                            day={day}
                            currentMonth={currentMonth}
                            tasks={tasks}
                            onToggleTask={onToggleTask}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;

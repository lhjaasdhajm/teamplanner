/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  eachWeekOfInterval
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  User, 
  Briefcase,
  CheckCircle2,
  LayoutGrid,
  CalendarDays,
  ChevronDown,
  Check,
  Filter,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { generateSchedule, type ScheduledTask, TASKS } from './types';
import { cn } from './lib/utils';

type ViewMode = 'day' | 'week' | 'month';
type CompletionFilter = 'all' | 'completed' | 'open';

interface TaskCardProps {
  task: ScheduledTask & { isGroup?: boolean; subtasks?: ScheduledTask[] };
  showDate?: boolean;
  isCompleted: boolean;
  onToggle: (instanceId: string) => void;
  completedTasks: Set<string>;
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 2)); // First Monday of March 2026
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const allAssignees = useMemo(() => Array.from(new Set(TASKS.map(t => t.assignee))), []);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set(TASKS.map(t => t.client)));
  const [selectedAssignees, setSelectedAssignees] = useState<Set<string>>(new Set(allAssignees));
  const [tempClients, setTempClients] = useState<Set<string>>(new Set(selectedClients));
  const [tempAssignees, setTempAssignees] = useState<Set<string>>(new Set(selectedAssignees));
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const socket = useMemo(() => io(), []);

  useEffect(() => {
    // Fetch initial state
    fetch('/api/completed-tasks')
      .then(res => res.json())
      .then(data => setCompletedTasks(new Set(data)));

    // Socket listeners
    socket.on('task:added', (instanceId: string) => {
      setCompletedTasks(prev => {
        const next = new Set(prev);
        next.add(instanceId);
        return next;
      });
    });

    socket.on('task:removed', (instanceId: string) => {
      setCompletedTasks(prev => {
        const next = new Set(prev);
        next.delete(instanceId);
        return next;
      });
    });

    return () => {
      socket.off('task:added');
      socket.off('task:removed');
    };
  }, [socket]);

  const hasPendingChanges = useMemo(() => {
    if (tempClients.size !== selectedClients.size) return true;
    if (tempAssignees.size !== selectedAssignees.size) return true;
    for (const c of tempClients) if (!selectedClients.has(c)) return true;
    for (const a of tempAssignees) if (!selectedAssignees.has(a)) return true;
    return false;
  }, [tempClients, selectedClients, tempAssignees, selectedAssignees]);

  const applyFilters = () => {
    setSelectedClients(new Set(tempClients));
    setSelectedAssignees(new Set(tempAssignees));
    setIsClientDropdownOpen(false);
    setIsAssigneeDropdownOpen(false);
  };

  const availableClients = useMemo(() => {
    const clients = new Set<string>();
    TASKS.forEach(t => {
      if (tempAssignees.has(t.assignee)) {
        clients.add(t.client);
      }
    });
    return Array.from(clients);
  }, [tempAssignees]);

  const allClients = useMemo(() => Array.from(new Set(TASKS.map(t => t.client))), []);

  const schedule = useMemo(() => generateSchedule(currentDate), [currentDate]);

  const toggleClient = (client: string) => {
    setTempClients(prev => {
      const next = new Set(prev);
      if (next.has(client)) {
        if (next.size > 1) next.delete(client);
      } else {
        next.add(client);
      }
      return next;
    });
  };

  const toggleAssignee = (assignee: string) => {
    setTempAssignees(prev => {
      const next = new Set(prev);
      if (next.has(assignee)) {
        if (next.size > 1) next.delete(assignee);
      } else {
        next.add(assignee);
      }
      return next;
    });
  };

  const toggleTask = (instanceId: string) => {
    // Optimistic update
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(instanceId)) {
        next.delete(instanceId);
      } else {
        next.add(instanceId);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F8AF5F', '#ffffff', '#000000']
        });
      }
      return next;
    });

    // Send to server
    if (socket && socket.connected) {
      socket.emit('task:toggle', instanceId);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthFilteredTasks = useMemo(() => {
    return schedule.filter(t => selectedClients.has(t.client) && selectedAssignees.has(t.assignee) && isSameMonth(t.date, currentDate));
  }, [schedule, selectedClients, selectedAssignees, currentDate]);

  const baseFilteredTasks = useMemo(() => {
    let tasks = schedule.filter(t => selectedClients.has(t.client) && selectedAssignees.has(t.assignee));
    if (viewMode === 'day') {
      tasks = tasks.filter(t => isSameDay(t.date, selectedDate));
    } else if (viewMode === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      tasks = tasks.filter(t => t.date >= start && t.date <= end);
    } else {
      tasks = tasks.filter(t => isSameMonth(t.date, currentDate));
    }
    return tasks;
  }, [schedule, viewMode, selectedDate, currentDate, selectedClients, selectedAssignees]);

  const monitoringFilteredTasks = useMemo(() => {
    let tasks = baseFilteredTasks;
    if (isMonitoring) {
      tasks = tasks.filter(t => t.frequency !== 'Dagelijks');
    }
    return tasks;
  }, [baseFilteredTasks, isMonitoring]);

  const filteredTasks = useMemo(() => {
    let tasks = monitoringFilteredTasks;
    if (completionFilter === 'completed') {
      tasks = tasks.filter(t => completedTasks.has(t.instanceId));
    } else if (completionFilter === 'open') {
      tasks = tasks.filter(t => !completedTasks.has(t.instanceId));
    }
    return tasks;
  }, [monitoringFilteredTasks, completionFilter, completedTasks]);

  const finalTasks = useMemo(() => {
    const dailyTasks = filteredTasks.filter(t => t.frequency === 'Dagelijks');
    const otherTasks = filteredTasks.filter(t => t.frequency !== 'Dagelijks');
    
    if (dailyTasks.length === 0) return otherTasks;

    // Group by title and date
    const dailyGroups: Record<string, ScheduledTask[]> = {};
    dailyTasks.forEach(t => {
      const dateKey = format(t.date, 'yyyy-MM-dd');
      const groupKey = `${t.title}-${dateKey}`;
      if (!dailyGroups[groupKey]) dailyGroups[groupKey] = [];
      dailyGroups[groupKey].push(t);
    });

    const result: any[] = [];
    Object.entries(dailyGroups).forEach(([groupKey, tasks]) => {
      if (tasks.length > 1) {
        result.push({
          ...tasks[0],
          instanceId: `daily-group-${groupKey}`,
          isGroup: true,
          subtasks: tasks
        });
      } else {
        result.push(tasks[0]);
      }
    });

    return [...result, ...otherTasks].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredTasks]);

  const stats = useMemo(() => {
    const total = monitoringFilteredTasks.length;
    const completed = monitoringFilteredTasks.filter(t => completedTasks.has(t.instanceId)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [monitoringFilteredTasks, completedTasks]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-uplifting-yellow rounded-xl flex items-center justify-center text-white shadow-lg shadow-uplifting-yellow/20">
                <CalendarDays size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-koho">Team Planner</h1>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                    className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    Medewerkers: {tempAssignees.size === allAssignees.length ? 'Alle' : Array.from(tempAssignees).join(', ')}
                    <ChevronDown size={12} />
                  </button>

                  <div className="h-4 w-px bg-slate-200 mx-1" />

                  <button 
                    onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                    className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    Klanten: {tempClients.size === allClients.length ? 'Alle' : Array.from(tempClients).filter(c => availableClients.includes(c)).join(', ')}
                    <ChevronDown size={12} />
                  </button>

                  {hasPendingChanges && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={applyFilters}
                      className="ml-4 px-3 py-1 bg-uplifting-yellow text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-uplifting-yellow/20 hover:bg-slate-900 transition-all"
                    >
                      Verversen
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {isAssigneeDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsAssigneeDropdownOpen(false)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-2 overflow-hidden"
                        >
                          {allAssignees.map(assignee => (
                            <button
                              key={assignee}
                              onClick={() => toggleAssignee(assignee)}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <span className={cn(
                                "font-medium",
                                tempAssignees.has(assignee) ? "text-uplifting-yellow" : "text-slate-700"
                              )}>
                                {assignee}
                              </span>
                              {tempAssignees.has(assignee) && (
                                <Check size={16} className="text-uplifting-yellow" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isClientDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsClientDropdownOpen(false)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-32 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-2 overflow-hidden"
                        >
                          {availableClients.map(client => (
                            <button
                              key={client}
                              onClick={() => toggleClient(client)}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <span className={cn(
                                "font-medium",
                                tempClients.has(client) ? "text-uplifting-yellow" : "text-slate-700"
                              )}>
                                {client}
                              </span>
                              {tempClients.has(client) && (
                                <Check size={16} className="text-uplifting-yellow" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('day')}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                    viewMode === 'day' ? "bg-white text-uplifting-yellow shadow-sm" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Dag
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                    viewMode === 'week' ? "bg-white text-uplifting-yellow shadow-sm" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                    viewMode === 'month' ? "bg-white text-uplifting-yellow shadow-sm" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Maand
                </button>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                  isMonitoring 
                    ? "bg-uplifting-yellow text-white border-uplifting-yellow shadow-lg shadow-uplifting-yellow/20" 
                    : "bg-white text-slate-700 border-slate-200 hover:border-uplifting-yellow/30"
                )}
              >
                <List size={18} />
                Monitoring
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Controls */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 font-koho">
                  {format(currentDate, 'MMMM yyyy', { locale: nl })}
                </h2>
                <div className="flex gap-1">
                  <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['M', 'D', 'W', 'D', 'V', 'Z', 'Z'].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderMiniCalendar(currentDate, selectedDate, setSelectedDate, monthFilteredTasks)}
              </div>
            </div>

            <div className="bg-uplifting-yellow rounded-2xl p-6 text-slate-900 shadow-sm border border-uplifting-yellow/30">
              <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4 font-koho">
                Statistieken ({viewMode === 'day' ? 'Dag' : viewMode === 'week' ? 'Week' : 'Maand'})
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold opacity-70">Voltooid</p>
                  <p className="text-sm font-black">{stats.completed} / {stats.total}</p>
                </div>
                <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden border border-black/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    className="bg-white h-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </div>
                <p className="text-[10px] text-center font-bold opacity-60 uppercase tracking-widest">
                  {stats.percentage}% voltooid
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + currentDate.getTime() + selectedDate.getTime() + isMonitoring}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-koho tracking-tight">
                      {isMonitoring ? "Voortgang Monitoring" : (
                        <>
                          {viewMode === 'day' && format(selectedDate, 'EEEE d MMMM', { locale: nl })}
                          {viewMode === 'week' && `Week ${format(selectedDate, 'w')}, ${format(currentDate, 'yyyy')}`}
                          {viewMode === 'month' && `Planning ${format(currentDate, 'MMMM yyyy', { locale: nl })}`}
                        </>
                      )}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {isMonitoring 
                        ? `Niet-dagelijkse taken (${viewMode === 'day' ? 'dag' : viewMode === 'week' ? 'week' : 'maand'})` 
                        : `${filteredTasks.length} taken gepland voor deze periode`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start sm:self-center">
                    {(['all', 'open', 'completed'] as CompletionFilter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setCompletionFilter(f)}
                        className={cn(
                          "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                          completionFilter === f 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        {f === 'all' ? 'Alle' : f === 'open' ? 'Open' : 'Gedaan'}
                      </button>
                    ))}
                  </div>
                </div>

                {finalTasks.length > 0 ? (
                  <div className="grid gap-4">
                    {finalTasks.map((task, idx) => (
                      <TaskCard 
                        key={`${task.instanceId}-${idx}`} 
                        task={task} 
                        showDate={viewMode !== 'day' || isMonitoring} 
                        isCompleted={task.isGroup ? task.subtasks?.every(st => completedTasks.has(st.instanceId)) : completedTasks.has(task.instanceId)}
                        onToggle={toggleTask}
                        completedTasks={completedTasks}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                      <LayoutGrid size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Geen taken gevonden</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Er zijn geen taken gepland voor deze specifieke selectie.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

const TaskCard: React.FC<TaskCardProps> = ({ task, showDate, isCompleted, onToggle, completedTasks }) => {
  const categoryColors: Record<string, string> = {
    'Mailbox': 'bg-blue-50 text-blue-700 border-blue-100',
    'Inkopen': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Bank': 'bg-amber-50 text-amber-700 border-amber-100',
    'Salarissen': 'bg-purple-50 text-purple-700 border-purple-100',
    'Kas': 'bg-rose-50 text-rose-700 border-rose-100',
    'Afsluiting': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Facturatie': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  };

  if (task.isGroup && task.subtasks) {
    return (
      <motion.div 
        whileHover={{ scale: 1.005 }}
        className={cn(
          "bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-4 group transition-all",
          isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 hover:shadow-md hover:border-uplifting-yellow/30"
        )}
      >
        <div className="flex items-center gap-5">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors border",
            isCompleted ? "bg-white text-emerald-500 border-emerald-100" : (categoryColors[task.category] || "bg-slate-50 text-slate-600 border-slate-100")
          )}>
            {task.category === 'Mailbox' && <Clock size={20} />}
            {task.category === 'Inkopen' && <Briefcase size={20} />}
            {task.category === 'Bank' && <LayoutGrid size={20} />}
            {task.category === 'Salarissen' && <User size={20} />}
            {task.category === 'Kas' && <LayoutGrid size={20} />}
            {task.category === 'Afsluiting' && <CheckCircle2 size={20} />}
            {task.category === 'Facturatie' && <FileText size={20} />}
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" : (categoryColors[task.category] || "bg-slate-50 text-slate-600 border-slate-100")
              )}>
                {task.frequency}
              </span>
            </div>
            <h3 className={cn(
              "text-base font-semibold truncate transition-colors",
              isCompleted ? "text-slate-400 line-through" : "text-slate-900"
            )}>
              {task.title}
            </h3>
          </div>

          {showDate && (
            <div className="text-right shrink-0">
              <p className={cn("text-sm font-bold", isCompleted ? "text-slate-400" : "text-slate-900")}>
                {format(task.date, 'd MMM', { locale: nl })}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {task.subtasks.map(st => {
            const subCompleted = completedTasks.has(st.instanceId);
            return (
              <button
                key={st.instanceId}
                onClick={() => onToggle(st.instanceId)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  subCompleted 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-uplifting-yellow/30 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
                  subCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                )}>
                  {subCompleted && <Check size={12} strokeWidth={3} />}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm font-bold truncate", subCompleted && "line-through opacity-50")}>{st.client}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.005 }}
      className={cn(
        "bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-5 group transition-all",
        isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 hover:shadow-md hover:border-uplifting-yellow/30"
      )}
    >
      <button 
        onClick={() => onToggle(task.instanceId)}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
          isCompleted 
            ? "bg-emerald-500 border-emerald-500 text-white" 
            : "border-slate-300 text-transparent hover:border-uplifting-yellow"
        )}
      >
        <CheckCircle2 size={14} />
      </button>

      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors border",
        isCompleted ? "bg-white text-emerald-500 border-emerald-100" : (categoryColors[task.category] || "bg-slate-50 text-slate-600 border-slate-100")
      )}>
        {task.category === 'Mailbox' && <Clock size={20} />}
        {task.category === 'Inkopen' && <Briefcase size={20} />}
        {task.category === 'Bank' && <LayoutGrid size={20} />}
        {task.category === 'Salarissen' && <User size={20} />}
        {task.category === 'Kas' && <LayoutGrid size={20} />}
        {task.category === 'Afsluiting' && <CheckCircle2 size={20} />}
        {task.category === 'Facturatie' && <FileText size={20} />}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
            {task.client}
          </span>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
            isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" : (categoryColors[task.category] || "bg-slate-50 text-slate-600 border-slate-100")
          )}>
            {task.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {task.frequency} {task.frequencyDetail && `• ${task.frequencyDetail}`}
          </span>
        </div>
        <h3 className={cn(
          "text-base font-semibold truncate transition-colors",
          isCompleted ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-uplifting-yellow transition-colors"
        )}>
          {task.title}
        </h3>
      </div>

      {showDate && (
        <div className="text-right shrink-0">
          <p className={cn("text-sm font-bold", isCompleted ? "text-slate-400" : "text-slate-900")}>
            {format(task.date, 'd MMM', { locale: nl })}
          </p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
            {format(task.date, 'EEEE', { locale: nl })}
          </p>
        </div>
      )}
    </motion.div>
  );
};

function renderMiniCalendar(
  currentDate: Date, 
  selectedDate: Date, 
  setSelectedDate: (d: Date) => void,
  schedule: ScheduledTask[]
) {
  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return days.map((day, i) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isSelected = isSameDay(day, selectedDate);
    const hasTasks = schedule.some(t => isSameDay(t.date, day));

    return (
      <button
        key={i}
        onClick={() => setSelectedDate(day)}
        className={cn(
          "aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium relative transition-all",
          !isCurrentMonth && "text-slate-300",
          isCurrentMonth && !isSelected && "text-slate-600 hover:bg-slate-100",
          isSelected && "bg-uplifting-yellow text-white shadow-lg shadow-uplifting-yellow/20",
          isToday(day) && !isSelected && "text-uplifting-yellow font-bold"
        )}
      >
        {format(day, 'd')}
        {hasTasks && (
          <span className={cn(
            "absolute bottom-1 w-1 h-1 rounded-full",
            isSelected ? "bg-white" : "bg-uplifting-yellow"
          )} />
        )}
      </button>
    );
  });
}

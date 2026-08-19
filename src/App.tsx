import React, { useState, useEffect } from 'react';
import { MusicProvider } from './music/music-state';
import { Navbar } from './components/Navbar';
import { GlobalMusicBar } from './components/GlobalMusicBar';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { InformatikaView } from './components/InformatikaView';
import { BahasaIndonesiaView } from './components/BahasaIndonesiaView';
import { ScheduleView } from './components/ScheduleView';
import { GamesView } from './components/GamesView';
import { MusicView } from './components/MusicView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { NavigationTab, TaskItem, TaskStatus, TaskSubject } from './types';
import { loadTasks, saveTasks } from './data/tasks';
import { profileData } from './data/profile';
import { runMigrationIfNeeded } from './utils/migration';
import { Instagram, Phone, Mail, Sparkles, Heart } from 'lucide-react';

const VALID_TABS: NavigationTab[] = [
  'dashboard',
  'profile',
  'informatika',
  'bindo',
  'schedule',
  'games',
  'music'
];

function getInitialTab(): NavigationTab {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '').toLowerCase() as NavigationTab;
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
  }
  return 'dashboard';
}

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>(getInitialTab);
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  
  // Task Edit / Add Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskDefaultSubject, setTaskDefaultSubject] = useState<TaskSubject>('Informatika');

  // Task Detail Modal state (rich view from personal-workspace-mu.vercel.app)
  const [selectedDetailTask, setSelectedDetailTask] = useState<TaskItem | null>(null);

  // Sync hash changes with currentTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as NavigationTab;
      if (VALID_TABS.includes(hash)) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Run migration on first load
  useEffect(() => {
    runMigrationIfNeeded();
  }, []);

  // Save tasks to local persistence when updated
  const handleSaveTask = (task: TaskItem) => {
    const exists = tasks.some((t) => t.id === task.id);
    let updated: TaskItem[];
    if (exists) {
      updated = tasks.map((t) => (t.id === task.id ? task : t));
    } else {
      updated = [task, ...tasks];
    }
    setTasks(updated);
    saveTasks(updated);
    if (selectedDetailTask && selectedDetailTask.id === task.id) {
      setSelectedDetailTask(task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask(null);
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updated);
    saveTasks(updated);
    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask({ ...selectedDetailTask, status: newStatus });
    }
  };

  const openAddTask = (subject: TaskSubject) => {
    setEditingTask(null);
    setTaskDefaultSubject(subject);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskDefaultSubject(task.subject);
    setIsTaskModalOpen(true);
  };

  const openTaskDetail = (task: TaskItem) => {
    setSelectedDetailTask(task);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col selection:bg-pink-500 selection:text-white font-sans pb-32">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onTabChange={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleSelectTab}
            onViewTaskDetail={openTaskDetail}
            tasks={tasks}
          />
        )}

        {currentTab === 'profile' && <ProfileView />}

        {currentTab === 'informatika' && (
          <InformatikaView
            tasks={tasks}
            onAddTask={() => openAddTask('Informatika')}
            onViewTaskDetail={openTaskDetail}
            onEditTask={openEditTask}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'bindo' && (
          <BahasaIndonesiaView
            tasks={tasks}
            onAddTask={() => openAddTask('Bahasa Indonesia')}
            onViewTaskDetail={openTaskDetail}
            onEditTask={openEditTask}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'schedule' && <ScheduleView />}

        {currentTab === 'games' && <GamesView />}

        {currentTab === 'music' && <MusicView />}
      </main>

      {/* Footer with Social Contacts */}
      <footer id="global-footer" className="mt-16 border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-10 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Author Identity & School */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-[2px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-heading font-black text-sm text-violet-700">
                  KT
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                  <span>Kelly Tham</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold">
                    XI.3 Tata Boga
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  SMA Cinta Kasih Tzu Chi · Personal Digital Workspace
                </div>
              </div>
            </div>

            {/* Social Contact Links (Instagram, TikTok, WhatsApp, Email) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Instagram */}
              <a
                href={`https://instagram.com/${profileData.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200/80 font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{profileData.contact.instagram}</span>
              </a>

              {/* TikTok */}
              <a
                href={`https://tiktok.com/@${profileData.contact.tiktok.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-bold transition-all hover:scale-105 shadow-xs cursor-pointer"
              >
                <span className="text-cyan-400 font-black text-xs">🎵</span>
                <span>{profileData.contact.tiktok}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/62${profileData.contact.whatsapp.startsWith('0') ? profileData.contact.whatsapp.slice(1) : profileData.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{profileData.contact.whatsapp}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${profileData.contact.email}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{profileData.contact.email}</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 Kelly Tham · Dibuat dengan passion untuk tugas sekolah & musik.</p>
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
              <span>HTML5 · Tailwind CSS · IndexedDB</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Persistent Bottom Music Player Bar */}
      <GlobalMusicBar
        currentTab={currentTab}
        onNavigateToMusic={() => handleSelectTab('music')}
      />

      {/* Rich Task Detail Modal from personal-workspace-mu.vercel.app */}
      <TaskDetailModal
        task={selectedDetailTask}
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        onEdit={(task) => {
          setSelectedDetailTask(null);
          openEditTask(task);
        }}
        onUpdateStatus={(taskId, newStatus) => {
          handleUpdateStatus(taskId, newStatus);
        }}
      />

      {/* Task Edit / Create Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
        defaultSubject={taskDefaultSubject}
      />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}

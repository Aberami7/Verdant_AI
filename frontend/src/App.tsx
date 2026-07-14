import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AnalysisWorkspace from './components/AnalysisWorkspace';
import HistoryLibrary from './components/HistoryLibrary';
import AuthPage from './components/AuthPage';
import { AnalysisReport, User as UserType } from './types';
import { RefreshCw } from 'lucide-react';
import { safeFetchJson } from './lib/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const stored = localStorage.getItem('verdant_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'analyze' | 'history'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Load history from full-stack Express API on initialization
  const fetchHistory = async () => {
    if (!currentUser) return;
    setIsLoadingHistory(true);
    try {
      const data = await safeFetchJson<AnalysisReport[]>('/api/history');
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load analysis history safely:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      fetchHistory();
    } else {
      setReports([]);
      setIsLoadingHistory(false);
    }
  }, [currentUser]);

  // Handle successful auth (login or signup)
  const handleAuthSuccess = (user: UserType) => {
    localStorage.setItem('verdant_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  // Handle log out
  const handleLogout = () => {
    localStorage.removeItem('verdant_user');
    setCurrentUser(null);
    setUsername('');
    setCurrentTab('dashboard');
  };

  // Handle prepend on new successful analysis
  const handleAnalysisSuccess = (newReport: AnalysisReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  // Handle remove item from state list
  const handleDeleteSuccess = (deletedId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== deletedId));
  };

  // View a specific report in library from dashboard clicks
  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentTab('history');
  };

  // Render AuthPage if user is not authenticated
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex min-h-screen antialiased font-sans bg-slate-50 text-slate-950">
      {/* Sidebar navigation (Fixed and collapsible) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        username={username}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main container panel */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen bg-slate-50 text-slate-950">
        {isLoadingHistory && reports.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-2xl flex items-center justify-center animate-spin bg-slate-100 border border-slate-200">
              <RefreshCw className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-sans font-medium font-mono tracking-wide uppercase text-slate-500">
              SYNCHRONIZING VERDANT DATA...
            </p>
          </div>
        ) : (
          <div className="relative h-full">
            {/* Conditional Page Rendering */}
            {currentTab === 'dashboard' && (
              <Dashboard
                setCurrentTab={setCurrentTab}
              />
            )}
            
            {currentTab === 'analyze' && (
              <AnalysisWorkspace
                onAnalysisSuccess={handleAnalysisSuccess}
                username={username}
                setUsername={setUsername}
              />
            )}
            
            {currentTab === 'history' && (
              <HistoryLibrary
                reports={reports}
                onDeleteSuccess={handleDeleteSuccess}
                onRefresh={fetchHistory}
                initialSelectedReportId={selectedReportId}
                clearInitialSelectedReportId={() => setSelectedReportId(null)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

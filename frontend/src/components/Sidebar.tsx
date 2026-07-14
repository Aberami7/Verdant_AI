import React from 'react';
import { 
  Home, Beaker, Scroll, ChevronLeft, ChevronRight, Leaf, User, LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'analyze' | 'history';
  setCurrentTab: (tab: 'dashboard' | 'analyze' | 'history') => void;
  username: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  username, 
  isCollapsed, 
  setIsCollapsed,
  onLogout
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home, emoji: '🏠' },
    { id: 'analyze' as const, label: 'Analysis Workspace', icon: Beaker, emoji: '🔬' },
    { id: 'history' as const, label: 'History Library', icon: Scroll, emoji: '📜' }
  ];

  return (
    <aside 
      className={`h-screen sticky top-0 bg-gradient-to-br from-[#020b05] via-[#051c0e] to-[#010703] border-r border-emerald-950/40 shadow-xl flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className={`p-6 border-b border-white/5 flex items-center justify-between transition-all duration-300 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <Leaf className="w-4.5 h-4.5 text-[#061e10]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-sm tracking-widest text-white uppercase leading-none">VERDANT AI</span>
                <span className="text-[9px] text-emerald-400 font-mono tracking-wider mt-0.5">SAFETY WORKSTATION</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Leaf className="w-4.5 h-4.5 text-[#061e10]" />
            </div>
          )}

          {/* Collapse toggle button */}
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 mt-4">
          {!isCollapsed && (
            <p className="text-[10px] uppercase tracking-widest text-emerald-400/40 font-mono font-bold ml-2 mb-3">
              Workstation Navigation
            </p>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center rounded-xl transition-all duration-250 cursor-pointer ${
                  isCollapsed ? 'justify-center p-3.5' : 'gap-3 px-4 py-3.5'
                } ${
                  isActive 
                    ? 'bg-emerald-500 text-[#061e10] font-bold shadow-lg shadow-emerald-500/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#061e10]' : 'text-emerald-400'}`} />
                {!isCollapsed && (
                  <span className="text-sm font-sans tracking-wide">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {!isCollapsed ? (
          <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-sans font-bold text-white truncate leading-none">
                  {username || 'Analyst'}
                </span>
                <span className="text-[10px] text-emerald-400/60 font-mono tracking-wider mt-1 leading-none uppercase">
                  Station Active
                </span>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 hover:bg-white/5 border border-white/0 hover:border-white/10 rounded-lg text-white/50 hover:text-red-400 transition-all cursor-pointer shrink-0 animate-fadeIn"
                title="Sign out of station"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center justify-center" title={username || 'Analyst'}>
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 hover:bg-white/5 border border-white/0 hover:border-white/10 rounded-lg text-white/50 hover:text-red-400 transition-all cursor-pointer animate-fadeIn"
                title="Sign out of station"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center pt-1">
            <button 
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

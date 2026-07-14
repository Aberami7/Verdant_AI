import React from 'react';
import { Leaf, Scan, ArrowRight } from 'lucide-react';

interface DashboardProps {
  setCurrentTab: (tab: 'dashboard' | 'analyze' | 'history') => void;
}

export default function Dashboard({ setCurrentTab }: DashboardProps) {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-10 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/src/assets/images/dashboard_bg_1783616765306.jpg')` }}
    >
      {/* Subtle overlay to soften background details without any blur */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      
      {/* Top Welcome Card Container (Centered, Big, and Reflective Mirror Glass with Sheen) */}
      <div className="relative z-10 overflow-hidden bg-gradient-to-br from-[#020b05]/98 via-[#051c0e]/96 to-[#010703]/98 border-2 border-t-white/50 border-l-white/30 border-r-white/10 border-b-white/5 p-10 md:p-14 rounded-[32px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-6xl transition-all duration-500 hover:border-t-white/70 hover:shadow-[0_40px_80px_-10px_rgba(4,120,87,0.3)] hover:-translate-y-1">
        
        {/* Mirror Reflection/Specular Highlight sweep lines */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-60 -rotate-45 scale-150 translate-x-[-30%] translate-y-[-30%] transition-transform duration-1000 group-hover:translate-x-[30%] group-hover:translate-y-[30%]" />
        
        {/* Second mirror glare overlay for double depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-500/5 pointer-events-none" />
        
        {/* Highlighted rim accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
        
        <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/25 border border-emerald-300/50 rounded-full text-emerald-300 text-xs font-mono font-black tracking-wider uppercase">
            <Leaf className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>Verdant Ingredient Safety Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Verdant Ingredient <span className="text-emerald-400 font-black">Safety Workstation</span>
          </h2>
          <p className="text-sm text-slate-100 leading-relaxed font-black tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
            Analyze chemical structures, food packaging, and consumer cosmetic ingredients with Verdant AI. Scan ingredient labels to flag potential hazards, identify common allergens, and generate precise compliance dossiers instantly.
          </p>
        </div>
        
        {/* Dynamic Action Button */}
        <div className="w-full md:w-auto shrink-0 relative z-10">
          <button
            onClick={() => setCurrentTab('analyze')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 bg-emerald-400 text-[#03130a] hover:bg-emerald-300 rounded-2xl text-xs font-sans font-black uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <Scan className="w-4 h-4 text-[#03130a]" />
            <span>New Ingredient Scan</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#03130a]" />
          </button>
        </div>
      </div>

    </div>
  );
}

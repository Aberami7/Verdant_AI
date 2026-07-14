import React, { useState, useEffect } from 'react';
import { 
  History, Search, Trash2, Calendar, Shield, ExternalLink, 
  ChevronRight, AlertTriangle, CheckCircle, Info, HelpCircle, AlertOctagon, RefreshCw, X
} from 'lucide-react';
import { AnalysisReport } from '../types';
import { safeFetchJson } from '../lib/api';

interface HistoryLibraryProps {
  reports: AnalysisReport[];
  onDeleteSuccess: (deletedId: string) => void;
  onRefresh: () => void;
  initialSelectedReportId?: string | null;
  clearInitialSelectedReportId?: () => void;
}

export default function HistoryLibrary({ 
  reports, 
  onDeleteSuccess, 
  onRefresh, 
  initialSelectedReportId, 
  clearInitialSelectedReportId 
}: HistoryLibraryProps) {
  // Filters & searches
  const [searchTerm, setSearchTerm] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<'All' | 'Safe' | 'Moderate' | 'Hazardous'>('All');
  
  // Selected report details modal/overlay
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-focus report when linked from other pages (Dashboard)
  useEffect(() => {
    if (initialSelectedReportId) {
      const match = reports.find(r => r.id === initialSelectedReportId);
      if (match) {
        setSelectedReport(match);
      }
      if (clearInitialSelectedReportId) {
        clearInitialSelectedReportId();
      }
    }
  }, [initialSelectedReportId, reports, clearInitialSelectedReportId]);

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSafety = safetyFilter === 'All' || report.safety_level === safetyFilter;
    return matchesSearch && matchesSafety;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening report details
    if (!window.confirm('Are you sure you want to permanently delete this analysis record?')) {
      return;
    }

    setIsDeletingId(id);
    setErrorMsg(null);

    try {
      await safeFetchJson(`/api/history/${id}`, {
        method: 'DELETE',
      });

      onDeleteSuccess(id);
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete historical record.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const getSafetyBadgeStyle = (level: 'Safe' | 'Moderate' | 'Hazardous') => {
    switch (level) {
      case 'Safe':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hazardous':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  const getSafetyScoreColor = (level: 'Safe' | 'Moderate' | 'Hazardous') => {
    switch (level) {
      case 'Safe':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'Moderate':
        return 'text-amber-700 bg-amber-50 border border-amber-200';
      case 'Hazardous':
        return 'text-rose-700 bg-rose-50 border border-rose-200';
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-10 pb-24 text-slate-800">
      {/* Header and Sync Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-sans font-light tracking-tight text-slate-900 flex items-center gap-2.5">
            <History className="w-8 h-8 text-emerald-600" />
            <span>History Library</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, review, and manage previously saved product ingredients scans.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-[14px] text-xs font-sans font-bold shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchronize Library</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 shadow-sm text-sm animate-fade-in">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-semibold text-xs text-rose-700 underline">Dismiss</button>
        </div>
      )}

      {/* FILTER & SEARCH SYSTEM */}
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, brand, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Safety filter buttons */}
        <div className="flex gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-[14px] text-xs font-semibold self-start md:self-stretch">
          {['All', 'Safe', 'Moderate', 'Hazardous'].map((f) => (
            <button
              key={f}
              onClick={() => setSafetyFilter(f as any)}
              className={`px-4.5 py-2 rounded-[10px] transition-all cursor-pointer ${
                safetyFilter === f
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* HISTORICAL LOGS GRID / LIST */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="group bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-emerald-400/50 transition-all cursor-pointer flex flex-col justify-between gap-5 relative text-slate-800"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-emerald-700 truncate max-w-[130px]" title={report.company_name}>
                      {report.company_name}
                    </p>
                    <h3 className="font-sans font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors line-clamp-1" title={report.product_name}>
                      {report.product_name}
                    </h3>
                  </div>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-sans font-black text-xs shrink-0 border ${
                    getSafetyScoreColor(report.safety_level)
                  }`}>
                    {report.safety_score}
                  </div>
                </div>

                {/* Card summary or details preview */}
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                  {report.summary}
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    disabled={isDeletingId === report.id}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                    title="Delete record"
                  >
                    {isDeletingId === report.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-200 rounded-[24px]">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-sans font-bold text-slate-500">No Historical Records Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query, adjusting your safety filters, or submitting a new scan in the workspace.
          </p>
        </div>
      )}

      {/* FLOATING DETAILED SIDE PANEL (WHEN A SCANNED PRODUCT IS CLICKED) */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end z-50 animate-fade-in">
          <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto shadow-2xl p-8 flex flex-col justify-between border-l border-slate-200 animate-slide-in text-slate-800">
            <div className="space-y-8">
              {/* Drawer Title & Close Button */}
              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">HISTORICAL DOSSIER</span>
                  <h3 className="font-sans font-light text-slate-900 text-xl">Product Safety Profile</h3>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Core summary specs */}
              <div className="flex gap-5 items-start">
                {/* Score */}
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shrink-0 font-bold ${
                  getSafetyBadgeStyle(selectedReport.safety_level)
                }`}>
                  <span className="text-2xl font-black">{selectedReport.safety_score}</span>
                  <span className="text-[8px] font-mono tracking-widest leading-none">SCORE</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-emerald-700 font-mono">{selectedReport.company_name}</span>
                  <h4 className="font-sans font-bold text-slate-900 text-lg leading-tight">
                    {selectedReport.product_name}
                  </h4>
                  <div className="flex items-center gap-2.5 mt-1.5 text-xs text-slate-400 font-mono">
                    <span>Submitted by: <strong className="text-emerald-700">{selectedReport.username}</strong></span>
                    <span>•</span>
                    <span>{new Date(selectedReport.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Image Preview if present */}
              {selectedReport.image_path && (
                <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
                  <img
                    src={selectedReport.image_path}
                    alt="Analyzed panel image source"
                    className="w-full max-h-[220px] object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Clinical summary block */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <h5 className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5 uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Clinical Assessment</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Warnings and allergens */}
              {selectedReport.allergens.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <h5 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 leading-none">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Identified Allergens</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {selectedReport.allergens.map((allergen, i) => (
                      <span key={i} className="text-[10px] bg-rose-100 text-rose-800 font-sans font-bold border border-rose-200 px-2.5 py-0.5 rounded-md">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-sans font-bold text-emerald-700 uppercase tracking-wide">Report Recommendations:</h5>
                <ul className="space-y-1.5">
                  {selectedReport.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients Details table-list */}
              <div className="space-y-3">
                <h5 className="text-xs font-sans font-bold text-emerald-700 uppercase tracking-wide">Ingredients Analysis:</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {selectedReport.ingredients_details.map((ing, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{ing.name}</span>
                          <span className="text-[9px] font-mono text-emerald-700">({ing.category})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{ing.description}</p>
                      </div>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border shrink-0 ${
                        getSafetyBadgeStyle(ing.safety)
                      }`}>
                        {ing.safety}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions inside overlay */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
              <button
                onClick={(e) => {
                  handleDelete(selectedReport.id, e);
                }}
                className="px-4.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-sans font-bold text-xs border border-rose-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Dossier</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

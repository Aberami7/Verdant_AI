import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, Sparkles, CheckCircle2, AlertTriangle, 
  X, Loader2, ArrowRight, ShieldCheck, Heart, AlertOctagon, HelpCircle, Search, Info
} from 'lucide-react';
import { AnalysisReport, AnalysisStep } from '../types';
import { safeFetchJson } from '../lib/api';

interface AnalysisWorkspaceProps {
  onAnalysisSuccess: (newReport: AnalysisReport) => void;
  username: string;
  setUsername: (name: string) => void;
}

export default function AnalysisWorkspace({ onAnalysisSuccess, username, setUsername }: AnalysisWorkspaceProps) {
  // Form states
  const [productName, setProductName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI States
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 'upload', label: 'Image Upload', status: 'pending', message: 'Transmitting ingredient listing image...' },
    { id: 'ocr', label: 'EasyOCR Extraction', status: 'pending', message: 'Converting image pixels to raw character strings...' },
    { id: 'extraction', label: 'Ingredient Extraction', status: 'pending', message: 'Parsing raw strings into discrete chemical compounds...' },
    { id: 'analysis', label: 'Verdant Safety Analysis', status: 'pending', message: 'Cross-referencing toxicological database profiles...' },
    { id: 'formatting', label: 'Result Formatting', status: 'pending', message: 'Synthesizing report dashboard metrics...' },
    { id: 'storage', label: 'Database Storage', status: 'pending', message: 'Committing permanent record to historical database...' }
  ]);

  // Current analysis report result state (to show in the workspace after scanning)
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<'All' | 'Safe' | 'Moderate' | 'Hazardous'>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit the form to perform analysis
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please provide a Client Name / Username.');
      return;
    }
    if (!productName.trim()) {
      setErrorMessage('Please specify the Product Name.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMessage('Please specify the Manufacturing Company.');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Please upload or capture an ingredient list image.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setActiveReport(null);

    // Initialize/Reset steps
    const updatedSteps = steps.map(step => ({ ...step, status: 'pending' as const }));
    setSteps(updatedSteps);

    // Helper to sleep/simulate workflow steps
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Step 1: Upload
      setCurrentStepIndex(0);
      setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'processing' as const } : s));
      await delay(1200);
      setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'completed' as const } : s));

      // Step 2: EasyOCR
      setCurrentStepIndex(1);
      setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'processing' as const } : s));
      await delay(1500);
      setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'completed' as const } : s));

      // Step 3: Ingredient Extraction
      setCurrentStepIndex(2);
      setSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'processing' as const } : s));
      await delay(1200);
      setSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'completed' as const } : s));

      // Step 4: AI Analysis
      setCurrentStepIndex(3);
      setSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'processing' as const } : s));

      // Create FormData
      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('product_name', productName.trim());
      formData.append('company_name', companyName.trim());
      formData.append('image', selectedFile);

      // Perform real full-stack API call using robust safeFetchJson
      const report = await safeFetchJson<AnalysisReport>('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      setSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'completed' as const } : s));

      // Step 5: Formatting
      setCurrentStepIndex(4);
      setSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'processing' as const } : s));
      await delay(1000);
      setSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'completed' as const } : s));

      // Step 6: Storage
      setCurrentStepIndex(5);
      setSteps(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'processing' as const } : s));
      await delay(800);
      setSteps(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: 'completed' as const } : s));

      // Success
      setActiveReport(report);
      onAnalysisSuccess(report);

      // Reset file input and fields for next analysis
      setProductName('');
      setCompanyName('');
      setSelectedFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to complete safety analysis.');
      // Mark current step as failed
      setSteps(prev => prev.map((s, idx) => idx === currentStepIndex ? { ...s, status: 'failed' as const } : s));
    } finally {
      setIsProcessing(false);
      setCurrentStepIndex(-1);
    }
  };

  // Helper colors for Safety
  const getSafetyColor = (safety: 'Safe' | 'Moderate' | 'Hazardous') => {
    switch (safety) {
      case 'Safe':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          text: 'text-emerald-600',
          scoreBg: 'bg-emerald-500',
          accent: 'border-emerald-500'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          text: 'text-amber-600',
          scoreBg: 'bg-amber-500',
          accent: 'border-amber-500'
        };
      case 'Hazardous':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          text: 'text-rose-600',
          scoreBg: 'bg-rose-500',
          accent: 'border-rose-500'
        };
    }
  };

  // Filtered ingredients list
  const filteredIngredients = activeReport?.ingredients_details.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) || 
                          ing.category.toLowerCase().includes(ingredientSearch.toLowerCase());
    const matchesSafety = safetyFilter === 'All' || ing.safety === safetyFilter;
    return matchesSearch && matchesSafety;
  }) || [];

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-10 pb-24 text-slate-800">
      {/* Welcome & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-slate-300 pb-6">
        <div>
          <h2 className="text-3xl font-sans font-black tracking-tight text-slate-900">Analysis Workspace</h2>
          <p className="text-sm text-slate-700 font-bold mt-1">
            Submit a product packaging image for deep OCR character scanning and safety evaluations.
          </p>
        </div>
      </div>

      {/* ERROR MESSAGE BAR */}
      {errorMessage && !isProcessing && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-800 shadow-sm animate-shake">
          <AlertTriangle className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-slate-100 rounded-lg text-rose-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FORM INPUT & PROCESSING LAYOUT */}
      {!isProcessing && !activeReport && (
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Metadata Fields Section */}
          <div className="lg:col-span-5 space-y-6 bg-white border-2 border-slate-300 p-7 rounded-[24px] shadow-md">
            <h3 className="font-sans font-black text-slate-950 text-xl border-b-2 border-slate-200 pb-3">
              Product Information
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 font-mono">
                  Client / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    readOnly
                    value={username}
                    placeholder="E.g. Dr. Avery"
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-[14px] text-sm text-slate-500 font-bold cursor-not-allowed"
                    title="Username is automatically set from active analyst session"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 font-mono">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="E.g. Organic Energy Drink"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-[14px] text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 font-mono">
                  Manufacturing Company
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="E.g. WholeFoods Co."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-[14px] text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-[18px] font-sans font-black tracking-widest uppercase text-xs shadow-lg border-2 border-emerald-700 transition-all cursor-pointer"
              >
                <span>Launch Safety Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drag and Drop Uploader Section */}
          <div className="lg:col-span-7 space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-3 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[380px] transition-all duration-300 bg-white ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md scale-102'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/50 shadow-sm'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={imagePreview}
                    alt="Ingredient listing crop preview"
                    className="w-full max-h-[260px] object-contain rounded-2xl border-2 border-slate-300 shadow-sm"
                  />
                  <div className="flex justify-center items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-600 truncate max-w-xs">
                      {selectedFile?.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border-2 border-rose-200 flex items-center justify-center cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-[20px] inline-flex items-center justify-center text-emerald-600 shadow-sm">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-slate-900 text-base">Upload Ingredients Panel Image</h4>
                    <p className="text-xs text-slate-600 font-bold mt-1 max-w-sm mx-auto">
                      Drag and drop your product packaging photograph, or click to browse. Max size 10MB.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* PIPELINE PROGRESS VIEWER */}
      {isProcessing && (
        <div className="max-w-2xl mx-auto bg-white border-2 border-slate-300 p-10 rounded-[24px] shadow-lg space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            <h3 className="font-sans font-extrabold text-slate-900 text-xl">Processing Safety Pipeline</h3>
            <p className="text-xs text-slate-600 font-bold font-mono tracking-wider uppercase">
              CRITICAL WORKFLOW STEPS IN EXECUTION
            </p>
          </div>

          <div className="space-y-4 mt-6">
            {steps.map((step, idx) => {
              const isPending = step.status === 'pending';
              const isProcessing = step.status === 'processing';
              const isCompleted = step.status === 'completed';
              const isFailed = step.status === 'failed';

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl flex items-center gap-4 border transition-all duration-300 ${
                    isProcessing
                      ? 'bg-emerald-50 border-emerald-300/60 text-emerald-800 scale-101 shadow-sm'
                      : isCompleted
                      ? 'bg-slate-50 border-slate-200 text-slate-700 opacity-90'
                      : isFailed
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center shrink-0">
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isFailed ? (
                      <AlertOctagon className="w-5 h-5 text-rose-500" />
                    ) : (
                      <div className="w-5 h-5 border border-slate-300 rounded-full flex items-center justify-center font-mono text-[10px] text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-sans font-bold ${
                        isProcessing ? 'text-emerald-700' : isFailed ? 'text-rose-700' : 'text-slate-700'
                      }`}>
                        {step.label}
                      </span>
                      {isProcessing && (
                        <span className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase animate-pulse">
                          PROCESSING...
                        </span>
                      )}
                    </div>
                    {isProcessing && step.message && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5 animate-pulse">
                        {step.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED RESULTS DASHBOARD */}
      {activeReport && !isProcessing && (
        <div className="space-y-8 animate-fade-in text-slate-800 animate-fade-in">
          {/* Back Action / Summary Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-slate-300 p-4 rounded-2xl shadow-sm">
            <span className="text-xs font-mono font-bold text-slate-700">
              ANALYSIS REFERENCE ID: <span className="text-emerald-600 font-bold">{activeReport.id}</span>
            </span>
            <button
              onClick={() => setActiveReport(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-950 font-sans font-bold text-xs border-2 border-slate-300 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Analyze New Product
            </button>
          </div>

          {/* MAIN BANNER CARD - SCORE & HEALTH INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Score card */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-300 p-8 rounded-[24px] shadow-md flex flex-col justify-between text-center relative overflow-hidden">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest">
                  Safety Index
                </p>
                <p className="text-sm font-sans font-extrabold text-emerald-700">
                  {activeReport.company_name}
                </p>
                <h4 className="font-sans font-black text-slate-950 text-xl tracking-tight truncate px-2" title={activeReport.product_name}>
                  {activeReport.product_name}
                </h4>
              </div>

              {/* Score Circular Dial Display */}
              <div className="my-8 relative flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center relative shadow-inner">
                  {/* Outer safety colored glow border */}
                  <div className={`absolute inset-0 rounded-full border-8 border-transparent border-t-${activeReport.safety_level === 'Safe' ? 'emerald-500' : activeReport.safety_level === 'Moderate' ? 'amber-500' : 'rose-500'} animate-spin-slow`} />
                  <span className={`text-5xl font-sans font-black tracking-tighter ${
                    activeReport.safety_level === 'Safe' ? 'text-emerald-600' : activeReport.safety_level === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {activeReport.safety_score}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                    OUT OF 100
                  </span>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`px-4.5 py-1.5 rounded-full font-sans font-black text-xs tracking-widest uppercase border-2 ${
                  getSafetyColor(activeReport.safety_level).badge
                }`}>
                  {activeReport.safety_level} Rating
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  Computed on {new Date(activeReport.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Right Health insights description & Recommendations card */}
            <div className="lg:col-span-8 bg-white border-2 border-slate-300 p-8 rounded-[24px] shadow-md flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-sans font-black text-emerald-800 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Clinical Summary</span>
                </h3>
                <p className="text-sm text-slate-950 leading-relaxed font-sans font-bold">
                  {activeReport.summary}
                </p>
              </div>

              {/* Allergens warning panel */}
              {activeReport.allergens.length > 0 ? (
                <div className="p-4.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3.5 text-rose-950">
                  <AlertTriangle className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-sans font-black text-sm text-rose-950 leading-none">Allergens Detected</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activeReport.allergens.map((allergen, i) => (
                        <span key={i} className="text-xs bg-rose-100 text-rose-800 font-sans font-black border-2 border-rose-400 px-2.5 py-0.5 rounded-md">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-sans font-bold text-emerald-800">
                    No common allergens detected in standard database scans.
                  </span>
                </div>
              )}

              {/* Actionable Recommendations list */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="font-sans font-black text-emerald-800 text-sm">Actionable Safety Recommendations:</h4>
                <ul className="space-y-2">
                  {activeReport.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-900 font-sans font-bold leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* INGREDIENTS BREAKDOWN LIST */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-sans font-extrabold text-slate-950 flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-emerald-600 shrink-0" />
                  <span>Chemical & Ingredient Inventory</span>
                </h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">
                  Extracted chemical profiles, safety classifications, and biological implications.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search chemical..."
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-950 placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs font-semibold">
                  {['All', 'Safe', 'Moderate', 'Hazardous'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSafetyFilter(f as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        safetyFilter === f
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* GRID OF INGREDIENTS */}
            {filteredIngredients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIngredients.map((ing, i) => {
                  const safetyStyles = getSafetyColor(ing.safety);
                  return (
                    <div
                      key={i}
                      className="bg-white border-2 border-slate-300 rounded-[20px] p-5.5 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-sans font-black text-slate-950 text-sm tracking-tight truncate flex-1" title={ing.name}>
                            {ing.name}
                          </h4>
                          <span className={`text-[10px] font-mono tracking-wider font-black px-2 py-0.5 rounded border-2 uppercase shrink-0 ${
                            safetyStyles.badge
                          }`}>
                            {ing.safety}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-100 border-2 border-emerald-300 px-2 py-0.5 rounded">
                          {ing.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-sans font-bold line-clamp-3 hover:line-clamp-none transition-all duration-300">
                        {ing.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-[24px]">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-sans font-bold text-slate-500">No matching ingredients found</h4>
                <p className="text-xs text-slate-400 mt-1">Try modifying your search filter keywords.</p>
              </div>
            )}
          </div>

          {/* RAW OCR PANEL */}
          <details className="group bg-slate-50 border border-slate-200 rounded-[18px] p-5.5 transition-all">
            <summary className="flex items-center justify-between font-sans font-bold text-xs uppercase tracking-wider text-slate-400 cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>View Raw Scanned Characters</span>
              </div>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 p-4.5 bg-slate-100 text-emerald-800 font-mono text-xs rounded-xl overflow-x-auto border border-slate-200 leading-relaxed select-all">
              {activeReport.ingredients_raw || 'No raw characters scanned.'}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

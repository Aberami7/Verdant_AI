import React, { useState, useEffect } from 'react';
import { 
  Leaf, Lock, Mail, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle, Sparkles,
  Shield, AlertTriangle, Cpu, Check, Layers
} from 'lucide-react';
import { safeFetchJson } from '../lib/api';
import { User as UserType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onAuthSuccess: (user: UserType) => void;
}

const featureHighlights = [
  {
    icon: Cpu,
    title: "AI formulation engine",
    desc: "Instantly parses and decodes complex ingredient chains."
  },
  {
    icon: Shield,
    title: "Eco-toxicity scanning",
    desc: "Identifies environmental biohazard and carcinogen risk indices."
  },
  {
    icon: AlertTriangle,
    title: "Allergen detection matrix",
    desc: "Alerts on custom triggers, parabens, and synthetic irritants."
  }
];

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Typewriter effect state
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  // Cyclic pointer/highlight state for welcome screen bars
  const [activePointerIndex, setActivePointerIndex] = useState(1);

  useEffect(() => {
    if (mode !== 'welcome') return;
    const interval = setInterval(() => {
      setActivePointerIndex(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    const line1 = "Pure Ingredients.";
    const line2 = "Honest Science.";
    
    let i = 0;
    const timer1 = setInterval(() => {
      setText1(line1.slice(0, i + 1));
      i++;
      if (i >= line1.length) {
        clearInterval(timer1);
        
        let j = 0;
        const timer2 = setInterval(() => {
          setText2(line2.slice(0, j + 1));
          j++;
          if (j >= line2.length) {
            clearInterval(timer2);
          }
        }, 70);
      }
    }, 70);
    
    return () => {
      clearInterval(timer1);
    };
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError(null);
    setSuccessMessage(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateForm = (): boolean => {
    if (mode === 'signup') {
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    } else {
      if (!email.trim()) {
        setError('Username or Email is required.');
        return false;
      }
      if (!password) {
        setError('Password is required.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const response = await safeFetchJson<{ user: UserType }>('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password
          })
        });

        setSuccessMessage('Account created successfully! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(response.user);
        }, 1500);
      } else {
        const response = await safeFetchJson<{ user: UserType }>('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: email.trim(),
            password
          })
        });

        onAuthSuccess(response.user);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full bg-[#010803] bg-[radial-gradient(circle_at_center,_#022413_0%,_#010a04_60%,_#000301_100%)] flex flex-col relative overflow-x-hidden font-sans ${mode !== 'welcome' ? 'items-center justify-center p-4 sm:p-6 md:p-8' : ''}`}>
      
      {/* Background Visual 3D Leaf Image with slow motion panning and scaling (without blur) */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.img 
          src="/src/assets/images/3d_green_leaves_1783928240556.jpg"
          alt="Immersive 3D Green Leaves"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover origin-center opacity-60"
          animate={{
            scale: [1.02, 1.07, 1.02],
            x: [-4, 4, -4],
            y: [-2, 2, -2]
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Transparent dark gradient overlay for optimal readability of the text while showing crisp leaves */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-[#010803]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/90" />
        
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] [background-size:24px_24px] mix-blend-overlay" />
        
        {/* Dynamic moving background ambient lights */}
        <motion.div 
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[15%] left-[20%] w-[380px] h-[380px] rounded-full bg-emerald-500/12 blur-[130px] pointer-events-none"
        />
        <motion.div 
          animate={{
            x: [0, -70, 40, 0],
            y: [0, 50, -60, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[25%] right-[15%] w-[420px] h-[420px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none"
        />
        <motion.div 
          animate={{
            x: [0, 40, -50, 0],
            y: [0, 60, 30, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[45%] right-[25%] w-[320px] h-[320px] rounded-full bg-cyan-500/8 blur-[120px] pointer-events-none"
        />

        {/* Deep bottom glow & solid-blend layer to guarantee 100% full screen background coverage */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-gradient-to-t from-[#010803] via-[#010803]/95 to-transparent pointer-events-none" />
      </div>

      {mode === 'welcome' ? (
        // Premium Asymmetric Dribbble-Style Landing Layout for Welcome Mode
        <div className="w-full flex-1 flex flex-col relative z-20">
          
          {/* Header Navigation */}
          <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-30">
            <div className="flex items-center gap-3">
              <div className="inline-flex w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-sans font-extrabold tracking-wider text-white uppercase leading-none">
                  VERDANT AI
                </h1>
                <p className="text-white/40 font-mono text-[8px] tracking-widest uppercase mt-0.5">
                  Formulation Intelligence
                </p>
              </div>
            </div>
            
            {/* Header Navigation without the Sign In button as requested, keeping the brand header minimal and elegant */}
            <div className="flex items-center gap-3">
              {/* Left empty to align branding cleanly */}
            </div>
          </header>

          {/* Hero Segment */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-20 pt-8 pb-12">
            
            {/* Left Column: Heavy Typography & Text Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-widest">Bio-Intelligence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.05]">
                Discover <br />
                the formulations <br />
                of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]">future</span>
              </h1>

              {/* Tagline typewriter block */}
              <div className="text-emerald-400 font-mono text-sm tracking-widest uppercase flex items-center gap-1.5 h-6">
                <span>{text1}</span>
                {text1 === "Pure Ingredients." && <span> </span>}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-bold">
                  {text2}
                </span>
                {(text1 !== "Pure Ingredients." || text2 !== "Honest Science.") && (
                  <span className="inline-block w-[2px] h-[14px] bg-emerald-400 animate-pulse" />
                )}
              </div>

              <p className="text-sm text-white/50 max-w-xl leading-relaxed font-sans">
                Unlock next-generation chemical intelligence. Instantly analyze, grade, and audit product ingredient formulas with state-of-the-art bio-informatics and risk matrix indices.
              </p>

              {/* CTAs with only the primary initiate button as requested */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={() => setMode('login')}
                  className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-[#020d04] font-sans font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] border border-emerald-300/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <span>Initiate Platform</span>
                  <Sparkles className="w-4 h-4 text-[#020d04]" />
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Glassmorphic Containers */}
            <div className="lg:col-span-5 relative flex flex-col justify-center gap-4 py-8 px-2">
              {/* Soft, moving, organic background glows behind the containers */}
              <motion.div 
                animate={{
                  x: [-20, 20, -20],
                  y: [-15, 15, -15],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 right-1/4 w-[280px] h-[280px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" 
              />
              <motion.div 
                animate={{
                  x: [20, -20, 20],
                  y: [15, -15, 15],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" 
              />

              <div className="w-full max-w-[420px] space-y-4 relative">
                {/* Highlight glow card background that follows the active pointer index smoothly */}
                <motion.div
                  animate={{
                    y: activePointerIndex * 92, // Smoothly shifts vertically to focus behind the active container
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 14
                  }}
                  className="absolute left-[-20px] right-[-20px] h-[100px] bg-gradient-to-r from-emerald-500/20 to-teal-500/15 blur-[25px] rounded-2xl pointer-events-none z-0"
                  style={{ top: "0px" }}
                />

                {/* Container 1 */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 z-10 p-5 cursor-pointer flex items-center justify-between ${
                    activePointerIndex === 0 
                      ? 'border-emerald-400 bg-[#06150d] shadow-[0_0_30px_rgba(16,185,129,0.25)]' 
                      : 'border-white/10 bg-black/90 hover:border-white/20'
                  }`}
                  onClick={() => setMode('login')}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-colors duration-300 ${
                      activePointerIndex === 0 
                        ? 'bg-emerald-400 text-[#020d04] shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                        : 'bg-white/5 border border-white/10 text-white'
                    }`}>
                      01
                    </div>
                    <div>
                      <h4 className={`text-xs font-display font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                        activePointerIndex === 0 ? 'text-emerald-300' : 'text-white'
                      }`}>
                        Formula Decoding
                      </h4>
                      <p className={`text-[10px] font-mono uppercase mt-0.5 transition-colors duration-300 ${
                        activePointerIndex === 0 ? 'text-emerald-100/70' : 'text-white/60'
                      }`}>
                        Bio-Informatics Parser
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    {activePointerIndex === 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-[9px] font-mono text-emerald-300 uppercase font-bold tracking-wider">ACTIVE</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono text-white/40 uppercase">READY</span>
                    )}
                  </div>
                </motion.div>

                {/* Container 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 z-10 p-5 cursor-pointer flex items-center justify-between ${
                    activePointerIndex === 1 
                      ? 'border-emerald-400 bg-[#06150d] shadow-[0_0_30px_rgba(16,185,129,0.25)]' 
                      : 'border-white/10 bg-black/90 hover:border-white/20'
                  }`}
                  onClick={() => setMode('login')}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-colors duration-300 ${
                      activePointerIndex === 1 
                        ? 'bg-emerald-400 text-[#020d04] shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                        : 'bg-white/5 border border-white/10 text-white'
                    }`}>
                      02
                    </div>
                    <div>
                      <h4 className={`text-xs font-display font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                        activePointerIndex === 1 ? 'text-emerald-300' : 'text-white'
                      }`}>
                        Eco-Toxicity Audit
                      </h4>
                      <p className={`text-[10px] font-mono uppercase mt-0.5 transition-colors duration-300 ${
                        activePointerIndex === 1 ? 'text-emerald-100/70' : 'text-white/60'
                      }`}>
                        Environmental Safeguard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    {activePointerIndex === 1 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-[9px] font-mono text-emerald-300 uppercase font-bold tracking-wider">ACTIVE</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono text-white/40 uppercase">READY</span>
                    )}
                  </div>
                </motion.div>

                {/* Container 3 */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 z-10 p-5 cursor-pointer flex items-center justify-between ${
                    activePointerIndex === 2 
                      ? 'border-emerald-400 bg-[#06150d] shadow-[0_0_30px_rgba(16,185,129,0.25)]' 
                      : 'border-white/10 bg-black/90 hover:border-white/20'
                  }`}
                  onClick={() => setMode('login')}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-colors duration-300 ${
                      activePointerIndex === 2 
                        ? 'bg-emerald-400 text-[#020d04] shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                        : 'bg-white/5 border border-white/10 text-white'
                    }`}>
                      03
                    </div>
                    <div>
                      <h4 className={`text-xs font-display font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                        activePointerIndex === 2 ? 'text-emerald-300' : 'text-white'
                      }`}>
                        Allergen Detection
                      </h4>
                      <p className={`text-[10px] font-mono uppercase mt-0.5 transition-colors duration-300 ${
                        activePointerIndex === 2 ? 'text-emerald-100/70' : 'text-white/60'
                      }`}>
                        Dermatological Safeguard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    {activePointerIndex === 2 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-[9px] font-mono text-emerald-300 uppercase font-bold tracking-wider">ACTIVE</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono text-white/40 uppercase">READY</span>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>



          {/* Footer Status Panel */}
          <footer className="w-full px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20 text-[10px] font-mono text-white/50 mt-auto">
            <span className="tracking-wider">© {new Date().getFullYear()} VERDANT AI. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-6">
              <span className="hover:text-emerald-300 transition-colors cursor-pointer">PRIVACY PROTOCOL</span>
              <span className="hover:text-emerald-300 transition-colors cursor-pointer">TERMS OF SERVICE</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SECURE NODE ACTIVE</span>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        // Highly-focused Centered Glassmorphic Workstation Card for Login & Signup Modes
        <div className={`w-full ${mode === 'signup' ? 'max-w-5xl' : 'max-w-2xl'} relative z-20 flex flex-col justify-center transition-all duration-500 ease-in-out`}>
          
          {/* Feedback Messages */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4.5 rounded-xl bg-red-950/95 border border-red-500/40 flex items-start gap-2.5 text-red-100 text-xs shadow-lg shadow-black/60 relative z-30 font-medium"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4.5 rounded-xl bg-emerald-950/95 border border-emerald-500/40 flex items-start gap-2.5 text-emerald-100 text-xs shadow-lg shadow-black/60 relative z-30 font-medium"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="flex items-center gap-1">
                {successMessage}
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </motion.div>
          )}

          {/* Card Frame: Highly polished transparent glassmorphic dark mirror-glass for maximum gloss and transparency (without blur) */}
          <div className={`bg-black/60 border-[1.5px] border-white/30 rounded-2xl ${mode === 'signup' ? 'p-10 sm:p-14 md:p-16' : 'p-8 sm:p-10 md:p-12'} shadow-[0_0_60px_rgba(16,185,129,0.22),_0_20px_50px_rgba(0,0,0,0.92)] hover:shadow-[0_0_75px_rgba(16,185,129,0.32),_0_20px_50px_rgba(0,0,0,0.96)] hover:border-white/50 transition-all duration-500 relative overflow-hidden group`}>
            
            {/* Mirror reflection lines across the card surface to sell the gloss glass effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.2] pointer-events-none mix-blend-overlay z-10" />
            
            {/* Elegant horizontal highlight strip at the very top */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent z-10" />

            {/* Seamless integrated logo branding row */}
            <div className="flex items-center gap-3 justify-center mb-8 pb-5 border-b border-white/20 relative z-10">
              <div className="inline-flex w-8 h-8 bg-emerald-500/20 border border-emerald-400/40 rounded-lg items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-left">
                <h1 className="text-base font-sans font-extrabold tracking-wider text-white uppercase leading-none">
                  VERDANT AI
                </h1>
                <p className="text-white/80 font-mono text-[9px] tracking-widest uppercase mt-0.5 font-extrabold">
                  Formulation Intelligence
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 10 : -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-5 relative z-10"
              >
                <div>
                  <h2 className="text-lg font-sans font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    {mode === 'login' ? (
                      <>
                        <LogIn className="w-5 h-5 text-emerald-300 shrink-0" />
                        <span>Station Login</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 text-emerald-300 shrink-0" />
                        <span>Create Account</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-white font-bold mt-1 leading-relaxed">
                    {mode === 'login' 
                      ? 'Identify yourself to initiate chemical scans.' 
                      : 'Register as an authorized ingredient analyst.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4.5">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <User className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            placeholder="e.g. jdoe"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <Mail className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="e.g. jane@verdant.ai"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <Lock className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-emerald-300" /> : <Eye className="w-4 h-4 text-emerald-300" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <Lock className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Username or Email
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <User className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="Enter username or email"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-extrabold text-emerald-300 uppercase tracking-widest">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white">
                            <Lock className="w-4 h-4 text-emerald-300" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="w-full bg-black/60 border-[1.5px] border-white/30 hover:border-emerald-400 focus:border-emerald-400 focus:bg-black/85 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/60 focus:outline-none transition-all font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-emerald-300" /> : <Eye className="w-4 h-4 text-emerald-300" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:from-emerald-600/50 disabled:to-teal-600/50 disabled:cursor-not-allowed text-[#04140a] font-sans font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.25)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] border border-emerald-300/20 transition-all duration-300 flex items-center justify-center gap-2 mt-6 cursor-pointer uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[#04140a]/20 border-t-[#04140a] rounded-full animate-spin" />
                    ) : mode === 'login' ? (
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                      </span>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={isLoading}
                    className="text-xs font-sans font-medium text-white/40 hover:text-emerald-450 hover:underline transition-all cursor-pointer"
                  >
                    {mode === 'login' ? (
                      "Create an account"
                    ) : (
                      "Back to login"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('welcome');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    disabled={isLoading}
                    className="text-xs font-sans font-medium text-emerald-450 hover:text-emerald-300 hover:underline transition-all cursor-pointer"
                  >
                    ← Welcome Screen
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mt-4 px-2">
            <span>Verdant AI v3.5</span>
            <div className="flex items-center gap-1 text-emerald-400/60">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>SECURE STATION LINK</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

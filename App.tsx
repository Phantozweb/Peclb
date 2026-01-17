import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Eye, Container, ArrowUpRight, Scan, LogOut } from 'lucide-react';
import { User } from './secure';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white">
      
      {/* LEFT SIDE - Immersive Info Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-20 overflow-hidden text-white bg-slate-950 h-screen sticky top-0">
        
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* Deep base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary-950 to-slate-900" />
          
          {/* Animated Orbs */}
          <div className={`absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[120px] mix-blend-screen animate-float transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen animate-float-delayed transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        </div>

        {/* Header Content */}
        <div className={`relative z-10 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-primary-500/50" />
            <span className="text-primary-400 text-xs font-bold tracking-[0.2em] uppercase">System Operational</span>
          </div>
          
          <h2 className="text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
            FocusCase<span className="text-primary-500">X</span>
            <br />
            Module
          </h2>
        </div>

        {/* Center/Main Visual Feature */}
        <div className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-1000 delay-200 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="glass-panel rounded-3xl p-8 border border-white/10 relative group hover:border-primary-500/30 transition-colors duration-500 max-w-xl">
             {/* Glowing corner accents */}
             <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary-500/50 rounded-tl-lg" />
             <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary-500/50 rounded-br-lg" />
             
             <div className="flex items-start gap-6">
                <div className="relative">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/50">
                      <Container className="w-8 h-8 text-white" strokeWidth={1.5} />
                   </div>
                   {/* Scanning effect */}
                   <div className="absolute -inset-4 border border-primary-500/20 rounded-3xl animate-pulse-glow" />
                </div>
                
                <div className="space-y-3">
                   <h3 className="text-2xl font-semibold text-white tracking-tight">
                     Preethika Eye Cares
                   </h3>
                   <p className="text-slate-400 leading-relaxed font-light">
                     Experience the future of optical management. Fully custom made for <span className="text-white font-medium">Lens Box</span>.
                   </p>
                   
                   <div className="pt-4 flex items-center gap-3">
                      <div className="px-4 py-2 rounded-full bg-primary-950/50 border border-primary-500/20 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span className="text-xs font-bold text-primary-200 uppercase tracking-wide">India's First</span>
                      </div>
                      <span className="text-sm text-slate-400 font-medium">Opticals in Container</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`relative z-10 flex items-end justify-between transition-all duration-1000 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="space-y-1">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Presented By</p>
             <a 
               href="https://focuslinks.in" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group flex items-center gap-2 text-xl font-bold text-white hover:text-primary-400 transition-colors"
             >
               FocusLinks.in
               <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-primary-400 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
             </a>
           </div>
           
           <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <div className="w-8 h-2 rounded-full bg-primary-500" />
           </div>
        </div>
      </div>

      {/* RIGHT SIDE / MOBILE MAIN CONTENT */}
      <div className="w-full lg:w-[45%] flex flex-col h-full bg-white relative">
         
         {/* MOBILE-ONLY BRAND HEADER */}
         <div className="lg:hidden bg-slate-950 py-10 px-6 relative overflow-hidden shrink-0 text-center">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4 animate-in zoom-in duration-500">
                  <Container className="w-7 h-7 text-white" strokeWidth={1.5} />
               </div>
               <h1 className="text-2xl font-bold text-white tracking-tight">LensBox</h1>
               <p className="text-primary-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">FocusCaseX Module</p>
            </div>
         </div>

         {/* LOGIN FORM CONTAINER */}
         <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
             <div className="w-full max-w-sm relative z-10 animate-slide-up-fade">
                
                {/* Desktop-Only Logo (Hidden on Mobile as it's in header) */}
                <div className="hidden lg:flex mb-12 flex-col items-center">
                   <div className="relative w-20 h-20 mb-6 group cursor-default">
                      {/* Rotating Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200 animate-spin-slow group-hover:border-primary-200 transition-colors" />
                      {/* Inner Glow */}
                      <div className="absolute inset-2 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-500" />
                      {/* The Eye */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                           <Eye className="w-10 h-10 text-slate-900 relative z-10" strokeWidth={1.5} />
                           {/* Iris Glow */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-400 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {/* Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-lg shadow-xl scale-0 group-hover:scale-100 transition-transform duration-300">
                         <Scan className="w-3 h-3" />
                      </div>
                   </div>

                   <div className="text-center space-y-2">
                     <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                       LensBox
                     </h1>
                     <p className="text-sm text-slate-500 font-medium">
                       {currentUser ? 'Secure Session Active' : 'Enter your credentials to access the portal'}
                     </p>
                   </div>
                </div>

                {currentUser ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-200/50 text-center animate-in fade-in zoom-in duration-300">
                     <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-primary-600 shadow-inner border border-primary-200">
                        {currentUser.initials}
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 mb-1">{currentUser.name}</h2>
                     <p className="text-sm text-slate-500 mb-6 font-medium">{currentUser.email}</p>
                     
                     <div className="flex items-center justify-center gap-2 mb-8">
                       <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{currentUser.role} Account</span>
                     </div>

                     <button 
                       onClick={handleLogout}
                       className="w-full relative group overflow-hidden rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0"
                     >
                       <span className="relative flex items-center justify-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                       </span>
                     </button>
                  </div>
                ) : (
                  <LoginForm onLogin={handleLoginSuccess} />
                )}

                {/* Mobile Footer */}
                <div className="mt-8 text-center lg:hidden pb-6">
                   <p className="text-xs text-slate-400">Presented by</p>
                   <a href="https://focuslinks.in" className="text-sm font-bold text-slate-900 hover:text-primary-600">
                     FocusLinks.in
                   </a>
                </div>
                
                {/* Desktop Copyright */}
                <div className="mt-10 pt-6 border-t border-slate-100 text-center hidden lg:block">
                   <p className="text-xs text-slate-400">
                     © 2024 LensBox System. Secure connection.
                   </p>
                </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default App;
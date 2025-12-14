import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Calendar, 
  ArrowRight, 
  Undo2,
  Clock
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// --- Mock Data ---
const MOCK_USER = {
  id: "123",
  name: "SteveCrafter",
  avatar: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg",
};

const CANCELLATION_DETAILS = {
  planName: "Monthly Subscription",
  endDate: "2026.01.14", // Mock
  daysLeft: 28,
};

// Raindrop Animation for background
const Raindrop = ({ delay, x }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ 
      y: ['0vh', '100vh'], 
      opacity: [0, 0.4, 0] 
    }}
    transition={{ 
      duration: 2 + Math.random() * 2, 
      delay: delay, 
      ease: "linear", 
      repeat: Infinity 
    }}
    className="absolute w-0.5 h-6 bg-slate-300 rounded-full"
    style={{ left: x }}
  />
);

export default function CancellationSuccessPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("discord_user")) || MOCK_USER;
    } catch {
      return MOCK_USER;
    }
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-300 text-slate-800 flex flex-col overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
      `}</style>

      {/* Subtle Rain Animation (Melancholic but calm) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <Raindrop 
            key={i} 
            delay={i * 0.5} 
            x={`${Math.random() * 100}%`} 
          />
        ))}
      </div>

      <Header 
        isLoggedIn={!!user} 
        user={user} 
        onLogin={() => {}} 
        onLogout={() => {}} 
        onScrollTop={scrollToTop} 
      />

      <main className="flex-grow pt-36 md:pt-44 pb-12 px-4 md:px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-xl w-full text-center">
          
          {/* Hero Icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-8 relative inline-block"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-slate-100 relative overflow-hidden">
               {/* Waving Hand Emoji Animation */}
               <motion.div
                 initial={{ rotate: 0 }}
                 animate={{ rotate: [0, 15, -10, 15, 0] }}
                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                 className="text-5xl select-none grayscale-[20%]"
               >
                 👋
               </motion.div>
            </div>
          </motion.div>
          
          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
              We're sad to see you go
            </h1>
            <p className="font-body text-slate-500 font-bold text-lg leading-relaxed max-w-sm mx-auto">
              解約手続きが完了しました。<br/>
              これまでご支援いただき、<br className="md:hidden" />本当にありがとうございました。
            </p>
          </motion.div>

          {/* Status Card (Ticket Style) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-left"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
              {/* Top gray bar */}
              <div className="h-2 bg-slate-300 w-full" />
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-700">
                      {CANCELLATION_DETAILS.planName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-sm font-bold text-slate-400">Cancelled</span>
                    </div>
                  </div>
                  
                  {/* Days Left Badge */}
                  <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Access</div>
                      <div className="font-display font-bold text-slate-700 text-sm">
                        {CANCELLATION_DETAILS.daysLeft} Days Left
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                   <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
                   <p className="text-sm text-slate-600 font-body leading-relaxed">
                     <strong className="text-slate-800">{CANCELLATION_DETAILS.endDate}</strong> まで特典（Discordロール、ゲーム内アイテム等）は引き続きご利用いただけます。期間終了後に自動的に無効化されます。
                   </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {/* Soft call to action to return */}
            <div className="text-center">
              <button className="group text-sm font-bold text-slate-500 hover:text-[#5fbb4e] transition-colors inline-flex items-center gap-1 font-body">
                <Undo2 size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                気が変わりましたか？ プランを再開する
              </button>
            </div>

            {/* Simple Text Button (Same style as PaymentSuccessPage) */}
            <div className="text-center">
              <a href="/membership" className="text-slate-400 font-bold font-body text-sm hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                <Home size={16} />
                Return to Top Page
              </a>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
}
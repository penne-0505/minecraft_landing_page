import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Home, 
  Copy, 
  ExternalLink, 
  MessageCircle, 
  Gamepad2,
  Sparkles,
  PartyPopper,
  Crown
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InteractiveClover from "../components/ui/InteractiveClover";

// --- Mock Data ---
// In a real implementation, you might fetch this based on session_id from URL
const MOCK_USER = {
  id: "123",
  name: "SteveCrafter",
  avatar: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg",
};

const PURCHASE_DETAILS = {
  id: "txn_8823_xh92",
  date: new Date().toLocaleDateString(),
  planName: "Monthly Subscription",
  amount: "¥300",
  paymentMethod: "Credit Card",
};

// Enhanced Confetti
const ConfettiParticle = ({ delay, x, type }) => {
  const colors = ['bg-yellow-400', 'bg-[#5fbb4e]', 'bg-pink-400', 'bg-blue-400', 'bg-purple-400'];
  const color = colors[type % colors.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 0, rotate: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: [0, 150 + Math.random() * 300], 
        x: [0, (Math.random() - 0.5) * 200], 
        rotate: [0, 180 + Math.random() * 360],
        scale: [0, 1, 0.8]
      }}
      transition={{ duration: 3 + Math.random() * 2, delay: delay, ease: "easeOut", repeat: Infinity, repeatDelay: Math.random() * 3 }}
      className={`absolute -top-10 w-3 h-3 rounded-sm ${color}`}
      style={{ left: x }}
    />
  );
};

// Glowing background aura
const GlowAura = () => (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-yellow-200/40 via-[#5fbb4e]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
);

export default function Thanks() {
  const [copied, setCopied] = useState(false);
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("discord_user")) || MOCK_USER;
    } catch {
      return MOCK_USER;
    }
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(PURCHASE_DETAILS.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans selection:bg-[#5fbb4e]/30 text-slate-800 flex flex-col overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .text-gradient-gold {
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <ConfettiParticle 
            key={i} 
            delay={i * 0.15} 
            x={`${Math.random() * 100}%`} 
            type={i}
          />
        ))}
      </div>

      <GlowAura />
      
      <Header 
        isLoggedIn={true} 
        user={user} 
        onLogin={() => {}} 
        onLogout={() => {}} 
        onScrollTop={scrollToTop} 
      />

      <main className="flex-grow pt-36 md:pt-44 pb-12 px-4 md:px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-xl w-full text-center">
          
          {/* Avatar Celebration Hero */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="mb-6 relative inline-block"
          >
            {/* Crown Icon */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: -35, opacity: 1, rotate: [0, -10, 10, 0] }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 text-yellow-400 drop-shadow-lg"
            >
              <Crown size={48} fill="currentColor" strokeWidth={1.5} />
            </motion.div>

            {/* Avatar with Ring */}
            <div className="relative z-10 p-2 bg-white rounded-full shadow-xl">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-yellow-300 relative bg-slate-100">
                <img src={user.avatar || MOCK_USER.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#5fbb4e] text-white p-2 rounded-full border-4 border-white shadow-lg">
                <Check size={20} strokeWidth={4} />
              </div>
            </div>

            {/* Sparkles around avatar */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-8 pointer-events-none"
            >
               <Sparkles className="absolute top-0 right-0 text-yellow-400" size={24} />
               <Sparkles className="absolute bottom-0 left-0 text-[#5fbb4e]" size={20} />
            </motion.div>
          </motion.div>
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-yellow-500 font-bold uppercase tracking-widest text-xs">
              <PartyPopper size={16} />
              <span>Welcome to the club</span>
              <PartyPopper size={16} className="scale-x-[-1]" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
              Thank You,<br/>
              <span className="text-gradient-gold">{user.name}!</span>
            </h1>
            <p className="font-body text-slate-500 font-bold text-lg md:text-xl max-w-sm mx-auto">
              ご支援ありがとうございます！<br/>
              あなたのサポートがサーバーの力になります。
            </p>
          </motion.div>

          {/* Membership Card (Receipt) */}
          <motion.div 
            initial={{ y: 40, opacity: 0, rotateX: -15 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="perspective-1000 mb-10"
          >
            <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative transform transition-transform hover:scale-[1.02] duration-300">
              {/* Gold decorative bar */}
              <div className="h-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 w-full" />
              
              <div className="p-8 pb-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-left">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-black text-[10px] uppercase tracking-wider mb-2">
                      Official Supporter
                    </span>
                    <h3 className="font-display font-bold text-xl text-slate-800">
                      {PURCHASE_DETAILS.planName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-2xl text-[#5fbb4e]">
                      {PURCHASE_DETAILS.amount}
                    </div>
                    <div className="text-xs font-bold text-slate-400">Paid</div>
                  </div>
                </div>

                <div className="relative h-px w-full bg-slate-200 my-6">
                  <div className="absolute -left-10 -top-3 w-6 h-6 rounded-full bg-[#f0f9ff]" />
                  <div className="absolute -right-10 -top-3 w-6 h-6 rounded-full bg-[#f0f9ff]" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left font-body text-sm">
                  <div>
                    <div className="text-slate-400 text-xs font-bold mb-1">Date</div>
                    <div className="font-bold text-slate-700">{PURCHASE_DETAILS.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-bold mb-1">Payment</div>
                    <div className="font-bold text-slate-700 flex items-center gap-2">
                      {PURCHASE_DETAILS.paymentMethod}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-400 text-xs font-bold mb-1">Transaction ID</div>
                    <div 
                      onClick={handleCopyId}
                      className="group flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-mono text-slate-600 text-xs">{PURCHASE_DETAILS.id}</span>
                      <span className="text-slate-400 group-hover:text-[#5fbb4e] transition-colors">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            {/* Discord Action */}
            <div className="group relative bg-white p-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#404EED] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-sm translate-y-2" />
              <div className="bg-white rounded-xl p-5 h-full flex flex-col items-center text-center border border-slate-100 group-hover:border-[#5865F2]/30 transition-colors">
                <div className="w-12 h-12 bg-[#5865F2]/10 text-[#5865F2] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle size={24} fill="currentColor" className="opacity-20 absolute" />
                  <MessageCircle size={24} className="relative z-10" />
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-1">Check Discord</h3>
                <p className="text-xs text-slate-500 font-bold mb-4">
                  ロールが付与されました！<br/>限定チャンネルへようこそ。
                </p>
                <button className="mt-auto w-full py-2 rounded-lg bg-[#5865F2] text-white text-sm font-bold shadow-[0_3px_0_#4752c4] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center gap-2">
                  Open Discord <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Server Action */}
            <div className="group relative bg-white p-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5fbb4e] to-[#3d9e30] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-sm translate-y-2" />
              <div className="bg-white rounded-xl p-5 h-full flex flex-col items-center text-center border border-slate-100 group-hover:border-[#5fbb4e]/30 transition-colors">
                <div className="w-12 h-12 bg-[#5fbb4e]/10 text-[#5fbb4e] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Gamepad2 size={24} fill="currentColor" className="opacity-20 absolute" />
                  <Gamepad2 size={24} className="relative z-10" />
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-1">Play Now</h3>
                <p className="text-xs text-slate-500 font-bold mb-4">
                  サーバーに参加して<br/>特典アイテムを受け取ろう！
                </p>
                <button className="mt-auto w-full py-2 rounded-lg bg-[#5fbb4e] text-white text-sm font-bold shadow-[0_3px_0_#4ea540] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center gap-2">
                  Copy IP Address <Copy size={14} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
          >
            <a href="/membership" className="text-slate-400 font-bold font-body text-sm hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              <Home size={16} />
              Return to Top Page
            </a>
          </motion.div>

        </div>
      </main>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
}
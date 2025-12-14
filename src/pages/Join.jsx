import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  MessageCircle, 
  Users, 
  Mic, 
  Gamepad2, 
  ShieldCheck, 
  Sparkles, 
  Hash, 
  Calendar
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// --- Mock Data ---
const ACTIVE_MEMBERS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zack",
];

const CHAT_MESSAGES = [
  { user: "Steve", color: "text-blue-500", msg: "今夜のエンドラ討伐、誰か行ける？ 🐉" },
  { user: "Alex", color: "text-green-500", msg: "装備整ったら行けます！" },
  { user: "Moderator", color: "text-red-500", msg: "21時からイベント開始です🎉" },
  { user: "Newbie", color: "text-slate-500", msg: "参加していいですか？" },
  { user: "Steve", color: "text-blue-500", msg: "もちろん！歓迎するよ 👋" },
];

// Floating Background Icon
const FloatingIcon = ({ icon: Icon, delay, x, y, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4], 
      y: [y, y - 20, y],
      scale: 1
    }}
    transition={{ 
      duration: 4, 
      delay: delay, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={`absolute ${color} pointer-events-none opacity-50 blur-[1px]`}
    style={{ left: x, top: y }}
  >
    <Icon size={32} />
  </motion.div>
);

const Join = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("discord_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Handle OAuth Redirect Logic from original Join.jsx
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    const state = url.searchParams.get("state");
    const targetPath = state && state.startsWith("/") ? state : "/membership";
    const targetUrl = new URL(targetPath, window.location.origin);
    targetUrl.searchParams.set("code", code);

    window.location.replace(targetUrl.toString());
  }, [location.search]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleLogin = () => {
    // Navigate to membership page or trigger login flow if needed
    window.location.href = "/membership"; 
  };

  const handleLogout = () => {
    localStorage.removeItem("discord_user");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#5865F2]/30 text-slate-800 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .text-gradient-discord {
          background: linear-gradient(135deg, #5865F2 0%, #404EED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <Header 
        isLoggedIn={!!user} 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        onScrollTop={scrollToTop} 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] -z-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#5865F2]/10 via-[#5fbb4e]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* Floating Icons */}
        <FloatingIcon icon={MessageCircle} delay={0} x="10%" y="20%" color="text-[#5865F2]" />
        <FloatingIcon icon={Gamepad2} delay={1.5} x="85%" y="15%" color="text-[#5fbb4e]" />
        <FloatingIcon icon={Mic} delay={0.8} x="80%" y="60%" color="text-pink-400" />
        <FloatingIcon icon={Users} delay={2.2} x="15%" y="70%" color="text-orange-400" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600 font-display tracking-wide">
                2,481 Online Now
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              もっと深く、<br className="md:hidden"/>
              <span className="text-gradient-discord">つながろう。</span>
            </h1>
            
            <p className="font-body text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Minecraft Server公式コミュニティへようこそ。<br className="hidden md:block"/>
              冒険の仲間募集、雑談、限定イベントの開催場所はここです。
            </p>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a 
                href="#" // TODO: Add real Discord Invite Link
                className="relative group bg-[#5865F2] text-white font-display font-black text-xl px-10 py-5 rounded-2xl shadow-[0_8px_0_#4752C4] hover:shadow-[0_4px_0_#4752C4] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <MessageCircle size={24} fill="currentColor" />
                Join Discord Server
              </a>
            </motion.div>

            {/* Avatars Pile */}
            <div className="mt-12 flex justify-center -space-x-4">
              {ACTIVE_MEMBERS.map((src, i) => (
                <motion.img 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={i}
                  src={src}
                  alt="Member"
                  className="w-12 h-12 rounded-full border-4 border-white shadow-lg bg-slate-100"
                />
              ))}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shadow-lg"
              >
                +10k
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Card 1: Community (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Hash size={200} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-2">活発なコミュニティ</h3>
                  <p className="font-body text-slate-500 font-bold">
                    初心者からベテランまで、毎日数百人のクラフターが交流しています。<br/>
                    建築自慢や回路の相談も、ここでなら即解決。
                  </p>
                </div>
                {/* Mock Chat Preview */}
                <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 shadow-inner">
                  {CHAT_MESSAGES.slice(0, 3).map((chat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full bg-slate-200 shrink-0`} />
                      <div>
                        <span className={`font-bold text-xs ${chat.color} mr-2`}>{chat.user}</span>
                        <span className="text-slate-600 font-body">{chat.msg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Voice Chat */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 bg-gradient-to-br from-[#5865F2] to-[#4752C4] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <Mic size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">Voice Chat</h3>
                <p className="font-body text-white/80 font-bold text-sm">
                  作業通話や冒険の連携に。<br/>聞き専Botも完備しています。
                </p>
              </div>
              {/* Audio Visualizer Animation */}
              <div className="flex items-end justify-center gap-1 h-16 opacity-80">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "80%", "40%", "90%", "30%"] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, repeatType: "mirror" }}
                    className="w-3 bg-white/50 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Card 3: Support */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#5fbb4e]/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="w-12 h-12 bg-[#5fbb4e]/10 text-[#5fbb4e] rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">手厚いサポート</h3>
              <p className="font-body text-slate-500 font-bold text-sm">
                困ったときはチケット機能で運営に直接相談。<br/>
                荒らし報告やバグ報告もスムーズです。
              </p>
            </motion.div>

            {/* Card 4: Events */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-[#f8fafc] rounded-3xl p-8 border-2 border-dashed border-slate-300 relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
            >
               <div className="flex-1 text-center md:text-left z-10">
                 <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-black uppercase mb-3">
                   <Sparkles size={12} /> Exclusive
                 </div>
                 <h3 className="font-display font-bold text-2xl mb-2 text-slate-800">Discord限定イベント</h3>
                 <p className="font-body text-slate-500 font-bold">
                   Nitro配布企画や、建築コンテストの投票はDiscordで行われます。<br/>
                   参加者だけの特典を見逃さないでください！
                 </p>
               </div>
               <div className="relative w-full md:w-1/3 aspect-video bg-white rounded-xl shadow-md p-4 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                 <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                   <Calendar size={16} className="text-pink-500" />
                   <span className="text-xs font-bold text-slate-700">Next Event</span>
                 </div>
                 <div className="text-center py-2">
                   <div className="text-3xl font-black text-slate-800 font-display">SAT, 20:00</div>
                   <div className="text-xs font-bold text-slate-400 mt-1">PvP Tournament</div>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#5865F2]/40 via-slate-900 to-slate-900" />
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6">
                Ready to Join?
              </h2>
              <p className="font-body text-slate-400 font-bold text-lg mb-10">
                参加は無料です。クリックひとつで、<br/>
                最高のクラフターライフが始まります。
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#5865F2] text-white font-display font-black text-xl px-12 py-6 rounded-2xl shadow-[0_0_40px_-10px_#5865F2] hover:shadow-[0_0_60px_-10px_#5865F2] transition-shadow flex items-center justify-center gap-3 mx-auto"
              >
                <MessageCircle size={28} fill="currentColor" />
                Join the Server Now
              </motion.button>
              
              <p className="mt-6 text-xs text-slate-600 font-bold font-body">
                ※Discordアカウントが必要です
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
};

export default Join;
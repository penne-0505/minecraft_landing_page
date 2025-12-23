import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle,
  Check, 
  Home, 
  Copy, 
  ExternalLink, 
  MessageCircle, 
  Sparkles,
  PartyPopper,
  Crown
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { beginDiscordLogin } from "../utils/discordAuth";
import { PLANS } from "../constants/plans";
import Seo from "../components/Seo";

const FALLBACK_AVATAR =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg";

const PAYMENT_METHOD_LABELS = {
  card: "Credit Card",
  konbini: "コンビニ",
  paypay: "PayPay",
  bank_transfer: "Bank Transfer",
  customer_balance: "Bank Transfer",
  cashapp: "Cash App",
  boleto: "Boleto",
};

const formatCurrency = (amount, currency) => {
  if (amount == null) return null;
  const upperCurrency = (currency || "JPY").toUpperCase();
  try {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: upperCurrency,
    }).format(amount);
  } catch {
    return `${amount} ${upperCurrency}`;
  }
};

const resolvePaymentMethodLabel = (methods = []) => {
  const method = methods[0];
  if (!method) return "Stripe";
  return PAYMENT_METHOD_LABELS[method] || method.replace("_", " ");
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
  const thanksTitle = "お申し込み完了";
  const thanksDescription = "メンバーシップ参加後の案内と次のステップをまとめています。";
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("discord_user")) || null;
    } catch {
      return null;
    }
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get("session_id");
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setError("決済セッションが見つかりませんでした。");
      setLoading(false);
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "決済データの取得に失敗しました。");
        }
        const data = await res.json();
        if (!ignore) {
          setSession(data.session || null);
        }
      } catch (err) {
        if (!ignore) {
          setError("決済データの取得に失敗しました。時間をおいてお試しください。");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [sessionId]);

  const isLoggedIn = !!(user && user.id);
  const handleLogout = () => {
    localStorage.removeItem("discord_user");
    setUser(null);
  };

  const handleCopyId = () => {
    if (!session?.transaction_id) return;
    navigator.clipboard.writeText(session.transaction_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const planName = useMemo(() => {
    if (!session) return "";
    const plan = session.price_type ? PLANS[session.price_type] : null;
    if (plan?.label) return `${plan.label} Plan`;
    return session.line_item_name || "Supporter Plan";
  }, [session]);

  const amountText = useMemo(() => {
    if (!session) return "";
    return formatCurrency(session.amount_total, session.currency);
  }, [session]);

  const dateText = useMemo(() => {
    if (!session?.created) return "";
    const date = new Date(session.created);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ja-JP");
  }, [session]);

  const paymentMethod = useMemo(() => {
    if (!session) return "";
    return resolvePaymentMethodLabel(session.payment_method_types);
  }, [session]);

  const accessBlocked = !loading && (error || !session);

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans selection:bg-[#5fbb4e]/30 text-slate-800 flex flex-col overflow-hidden relative">
      <Seo
        title={thanksTitle}
        description={thanksDescription}
        path="/thanks"
        type="website"
        noIndex
      />
      <style>{`
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
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={beginDiscordLogin}
        onLogout={handleLogout}
        onScrollTop={scrollToTop}
      />

      <main className="flex-grow pt-36 md:pt-44 pb-12 px-4 md:px-6 relative z-10 flex flex-col items-center">
        {accessBlocked ? (
          <div className="max-w-xl w-full text-center">
            <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle size={24} />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-slate-800 mb-3">
                決済情報を確認できませんでした
              </h1>
              <p className="font-body text-slate-500 font-bold mb-6">
                {error || "このページは決済完了後に表示されます。"}
              </p>
              <a
                href="/membership"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5fbb4e] text-white font-bold shadow-[0_4px_0_#469e38] active:translate-y-[3px] transition-all"
              >
                メンバーシップへ戻る
              </a>
            </div>
          </div>
        ) : (
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
                <img src={user?.avatar || FALLBACK_AVATAR} alt="User" className="w-full h-full object-cover" />
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
              <span className="text-gradient-gold">{user?.name || "Supporter"}!</span>
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
                {loading ? (
                  <div className="space-y-4 text-left">
                    <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse" />
                    <div className="h-6 w-48 bg-slate-100 rounded-full animate-pulse" />
                    <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-black text-[10px] uppercase tracking-wider mb-2">
                          Official Supporter
                        </span>
                        <h3 className="font-display font-bold text-xl text-slate-800">
                          {planName}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-black text-2xl text-[#5fbb4e]">
                          {amountText}
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
                        <div className="font-bold text-slate-700">{dateText}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs font-bold mb-1">Payment</div>
                        <div className="font-bold text-slate-700 flex items-center gap-2">
                          {paymentMethod}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-slate-400 text-xs font-bold mb-1">
                          Transaction ID
                        </div>
                        <div 
                          onClick={handleCopyId}
                          className={`group flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 transition-colors ${
                            session?.transaction_id ? "cursor-pointer hover:bg-slate-100" : "cursor-default opacity-60"
                          }`}
                        >
                          <span className="font-mono text-slate-600 text-xs">
                            {session.transaction_id || "N/A"}
                          </span>
                          <span className="text-slate-400 group-hover:text-[#5fbb4e] transition-colors">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-12"
          >
            {/* Discord Action */}
            <div className="group relative bg-white p-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm">
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
                <a 
                  href={import.meta.env.VITE_DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-2 rounded-lg bg-[#5865F2] text-white text-sm font-bold shadow-[0_3px_0_#4752c4] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center gap-2"
                >
                  Open Discord <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
          >
            <a href="/" className="text-slate-400 font-bold font-body text-sm hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              <Home size={16} />
              Return to Top Page
            </a>
          </motion.div>

        </div>
        )}
      </main>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
};

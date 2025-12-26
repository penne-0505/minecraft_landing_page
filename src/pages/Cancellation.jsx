import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle,
  Home, 
  Calendar, 
  ArrowRight, 
  Undo2,
  Clock
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { beginDiscordLogin } from "../utils/discordAuth";
import { PLANS } from "../constants/plans";
import Seo from "../components/Seo";

const FALLBACK_AVATAR =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg";

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
  const cancellationTitle = "解約手続き";
  const cancellationDescription =
    "メンバーシップの解約状況と次回更新日の案内ページです。";
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("discord_user")) || null;
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState("loading");
  const [subscription, setSubscription] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoggedIn = !!(user && user.id);

  useEffect(() => {
    if (!isLoggedIn) {
      setStatus("not-logged-in");
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    (async () => {
      try {
        setStatus("loading");
        const res = await fetch("/api/subscription-status", {
          signal: controller.signal,
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          if (res.status === 401) {
            setStatus("not-logged-in");
            return;
          }
          throw new Error(text || "Failed to load subscription status");
        }
        const data = await res.json();
        if (ignore) return;
        if (!data.ok) {
          if (data.reason === "not_cancelled" || data.reason === "not_found") {
            setStatus("not-cancelled");
          } else {
            setStatus("error");
            setErrorMessage("解約情報の取得に失敗しました。");
          }
          return;
        }
        setSubscription(data.subscription || null);
        setStatus("cancelled");
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setErrorMessage("解約情報の取得に失敗しました。");
        }
      }
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [isLoggedIn, user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("discord_user");
    setUser(null);
  };

  const planName = useMemo(() => {
    if (!subscription) return "";
    const plan = subscription.price_type ? PLANS[subscription.price_type] : null;
    if (plan?.label) return `${plan.label} Plan`;
    return subscription.plan_label || "Supporter Plan";
  }, [subscription]);

  const endDateText = useMemo(() => {
    if (!subscription) return "";
    const timestamp =
      subscription.current_period_end ||
      subscription.canceled_at ||
      subscription.ended_at;
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ja-JP");
  }, [subscription]);

  const daysLeft = subscription?.days_left ?? 0;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-300 text-slate-800 flex flex-col overflow-hidden relative">
      <Seo
        title={cancellationTitle}
        description={cancellationDescription}
        path="/cancellation"
        type="website"
        noIndex
      />
      <style>{`
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
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={beginDiscordLogin}
        onLogout={handleLogout}
        onScrollTop={scrollToTop}
      />

      <main className="flex-grow pt-36 md:pt-44 pb-12 px-4 md:px-6 relative z-10 flex flex-col items-center">
        {status !== "cancelled" ? (
          <div className="max-w-xl w-full text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-slate-100">
                <AlertCircle className="text-slate-500" size={32} />
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                {status === "not-logged-in"
                  ? "ログインが必要です"
                  : status === "not-cancelled"
                  ? "解約情報はありません"
                  : "情報の取得に失敗しました"}
              </h1>
              <p className="font-body text-slate-500 font-bold text-sm md:text-base leading-relaxed mb-6">
                {status === "not-logged-in"
                  ? "解約情報の確認にはログインが必要です。"
                  : status === "not-cancelled"
                  ? "現在、解約済みのサブスクリプションが見つかりませんでした。"
                  : errorMessage || "時間をおいてもう一度お試しください。"}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {status === "not-logged-in" ? (
                  <button
                    onClick={beginDiscordLogin}
                    className="px-6 py-3 rounded-xl bg-[#5fbb4e] text-white font-bold shadow-[0_4px_0_#469e38] active:translate-y-[3px] transition-all"
                  >
                    Discordでログイン
                  </button>
                ) : (
                  <a
                    href="/membership"
                    className="px-6 py-3 rounded-xl bg-[#5fbb4e] text-white font-bold shadow-[0_4px_0_#469e38] active:translate-y-[3px] transition-all"
                  >
                    メンバーシップへ戻る
                  </a>
                )}
                <a
                  href="/"
                  className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  トップページへ
                </a>
              </div>
            </div>
          </div>
        ) : (
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
              これまでご支援いただき、<br/>
              本当にありがとうございました。
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
                      {planName}
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
                        {daysLeft} Days Left
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                  <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-slate-600 font-body leading-relaxed">
                    <strong className="text-slate-800">{endDateText}</strong> まで特典（Discordロール、ゲーム内アイテム等）は引き続きご利用いただけます。期間終了後に自動的に無効化されます。
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
              <a href="/membership" className="group text-sm font-bold text-slate-500 hover:text-[#5fbb4e] transition-colors inline-flex items-center gap-1 font-body">
                <Undo2 size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                気が変わりましたか？ プランを再開する
              </a>
            </div>

            {/* Simple Text Button (Same style as PaymentSuccessPage) */}
            <div className="text-center">
              <a href="/" className="text-slate-400 font-bold font-body text-sm hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                <Home size={16} />
                Return to Top Page
              </a>
            </div>
          </motion.div>

        </div>
        )}
      </main>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
}

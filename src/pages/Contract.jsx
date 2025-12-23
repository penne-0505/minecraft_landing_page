import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight
} from "lucide-react";
import { trackEvent, captureError } from "../analytics";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { beginDiscordLogin } from "../utils/discordAuth";
import PricingComponent from "../components/ui/PricingComponent";
import Divider from "../components/ui/Divider";
import Seo from "../components/Seo";

export const CheckboxCard = ({ 
  checked, 
  onChange, 
  icon, 
  title, 
  description,
  tag 
}) => (
  <div 
    onClick={onChange}
    className={`
      group relative flex items-center gap-4 p-4 pr-6 rounded-2xl border transition-all duration-200 cursor-pointer select-none
      ${checked 
        ? 'bg-white border-slate-300 shadow-[0_4px_0_#e2e8f0] translate-y-[-2px]' 
        : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
      }
    `}
  >
    <div className={`
      w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
      ${checked ? 'bg-[#5865F2] text-white' : 'bg-slate-200 text-slate-400'}
    `}>
      {checked ? icon : <div className="grayscale opacity-50">{icon}</div>}
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h4 className={`font-display font-bold text-base ${checked ? 'text-slate-800' : 'text-slate-500'}`}>
          {title}
        </h4>
        {tag && (
          <span className="text-[10px] font-black bg-[#5fbb4e]/10 text-[#5fbb4e] px-2 py-0.5 rounded-full uppercase tracking-wider">
            {tag}
          </span>
        )}
      </div>
      <p className="font-body text-xs md:text-sm text-slate-500 leading-tight">
        {description}
      </p>
    </div>

    <div className={`
      w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center
      ${checked ? 'bg-[#5fbb4e]' : 'bg-slate-300'}
    `}>
      <motion.div 
        layout
        className="w-5 h-5 bg-white rounded-full shadow-sm"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  </div>
);

export default function Contract() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");
  const contractTitle = "プラン申し込み";
  const contractDescription =
    "メンバーシップの申し込み前に条件を確認し、決済へ進みます。";

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("discord_user");
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });

  const [agreements, setAgreements] = useState({
    discordRole: false,
    terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oauthRedirecting, setOauthRedirecting] = useState(false);

  const appBaseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const redirectUriClient = import.meta.env.VITE_DISCORD_REDIRECT_URI || `${appBaseUrl}/auth/callback`;

  // --- Logic from original Contract.jsx ---
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, "", url.toString());

    (async () => {
      try {
        const res = await fetch("/discord-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) {
          if (res.status === 401) {
            setError("認証に失敗しました。メンバーシップページへ戻ります。");
            setTimeout(() => { window.location.href = "/membership"; }, 1800);
          } else {
            setError("認証に失敗しました。もう一度お試しください。");
          }
          return;
        }
        const data = await res.json();
        if (data.user?.id) {
          const discordUser = {
            id: data.user.id,
            name: data.user.username,
            discriminator: data.user.discriminator,
            avatar: data.user.avatar
              ? `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`
              : null,
          };
          localStorage.setItem("discord_user", JSON.stringify(discordUser));
          setUser(discordUser);
          trackEvent("login_success", { provider: "discord", context: "contract" });
        }
      } catch (err) {
        captureError(err, { stage: "oauth_callback_contract" });
        setError("認証中にエラーが発生しました。");
      }
    })();
  }, []);

  const beginDiscordLogin = () => {
    trackEvent("login_start", { provider: "discord", context: "contract" });
    setOauthRedirecting(true);
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
      response_type: "code",
      scope: "identify guilds.join",
      redirect_uri: redirectUriClient,
      prompt: "consent",
      state: returnTo || "/membership",
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  useEffect(() => {
    if (!planParam) {
      window.location.replace("/membership");
      return;
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) return;

    if (!user) {
      beginDiscordLogin();
      return;
    }
  }, [user, planParam]);

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePayment = async () => {
    if (!user || !planParam || !agreements.terms || !agreements.discordRole) return;
    
    setIsLoading(true);
    trackEvent("checkout_start", { priceType: planParam });

    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceType: planParam,
          discord_user_id: user.id,
          avatar_url: user.avatar || null,
          consent_roles: agreements.discordRole,
          consent_terms: agreements.terms,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        captureError(new Error("Checkout create failed"), { priceType: planParam, text });
        setError("決済セッションの作成に失敗しました。しばらくしてからもう一度お試しください。");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      captureError(err, { stage: "checkout_start_contract", priceType: planParam });
      setError("ネットワークエラーが発生しました。しばらくしてからもう一度お試しください。");
      setIsLoading(false);
    }
  };

  const isPayable = agreements.terms && agreements.discordRole && !isLoading;

  if (!user) {
    return (
      <>
        <Seo
          title={contractTitle}
          description={contractDescription}
          path="/contract"
          type="website"
          noIndex
        />
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
          <div className="text-center space-y-3">
            {error ? (
              <>
                <div className="text-red-600 font-black text-lg">{error}</div>
                <div className="text-sm text-slate-500">数秒後に /membership へ戻ります。</div>
              </>
            ) : (
              <>
                <Loader2 className="animate-spin w-12 h-12 text-[#5fbb4e] mx-auto mb-4" />
                <p className="text-slate-600 font-bold">
                  {oauthRedirecting ? "Discord認証へ移動しています..." : "ページを準備しています..."}
                </p>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // --- Render (New UI) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    },
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans selection:bg-[#5fbb4e] selection:text-white flex flex-col">
      <Seo
        title={contractTitle}
        description={contractDescription}
        path="/contract"
        type="website"
        noIndex
      />
      <style>{`
        /* Align fonts with membership page */
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font, .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .btn-push:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>

      <Header 
        isLoggedIn={true} 
        user={user} 
        onLogin={beginDiscordLogin} 
        onLogout={() => { localStorage.removeItem("discord_user"); setUser(null); }} 
        onScrollTop={() => window.scrollTo(0, 0)} 
        brandHref="/membership"
      />

      <main className="flex-grow pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Title */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            
            {/* Left Col: Plan Card */}
            <motion.div variants={itemVariants} className="lg:col-span-5 order-2 lg:order-1">
              <div className="sticky top-28">
                <PricingComponent
                  initialPlanKey={planParam}
                  hideCTA
                  compact
                />
              </div>
            </motion.div>

            {/* Right Col: Agreements & Action */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <motion.div variants={itemVariants} className="mb-2 text-left">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  サポート内容の確認
                </h1>
                <p className="font-body text-slate-500 font-bold">
                  決済前の最終確認です。この段階では請求は発生しません。
                </p>
              </motion.div>
              
              {/* Agreements Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="pt-2 space-y-3">
                    <label 
                      className={`
                        group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer select-none
                        ${agreements.discordRole 
                          ? 'border-[#5fbb4e] bg-[#ecfdf5]/40' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }
                      `}
                    >
                      <div className="relative mt-0.5">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={agreements.discordRole}
                          onChange={() => toggleAgreement('discordRole')}
                        />
                        <div className={`
                          w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                          ${agreements.discordRole 
                            ? 'bg-[#5fbb4e] border-[#5fbb4e]' 
                            : 'bg-white border-slate-300 group-hover:border-slate-400'
                          }
                        `}>
                          <Check size={16} className="text-white" strokeWidth={4} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-bold text-slate-800 text-lg">Discordロールの付与</span>
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            必須
                          </span>
                        </div>
                        <p className="font-body text-slate-500 text-sm leading-tight">
                          ゲーム内特典付与のため、サポーターロールを自動付与します。
                        </p>
                      </div>
                    </label>

                    <label 
                      className={`
                        group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer select-none
                        ${agreements.terms 
                          ? 'border-[#5fbb4e] bg-[#ecfdf5]/30' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }
                      `}
                    >
                      <div className="relative mt-0.5">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={agreements.terms}
                          onChange={() => toggleAgreement('terms')}
                        />
                        <div className={`
                          w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                          ${agreements.terms 
                            ? 'bg-[#5fbb4e] border-[#5fbb4e]' 
                            : 'bg-white border-slate-300 group-hover:border-slate-400'
                          }
                        `}>
                          <Check size={16} className="text-white" strokeWidth={4} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-bold text-slate-800 text-lg">
                            利用規約への同意
                          </span>
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            必須
                          </span>
                        </div>
                        <div className="font-body text-slate-500 text-sm leading-relaxed">
                          <a
                            href="/legal/terms"
                            className="text-[#5fbb4e] underline hover:text-[#469e38]"
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            利用規約
                          </a>
                          および
                          <a
                            href="/legal/privacy"
                            className="text-[#5fbb4e] underline hover:text-[#469e38]"
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            プライバシーポリシー
                          </a>
                          に同意します。これはデジタルコンテンツの購入であることを理解しています。
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Actions Section */}
              <motion.div variants={itemVariants} className="pt-4 space-y-4">
                <Divider className="border-slate-200" />
                <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center justify-between">
                  <button 
                    onClick={() => window.location.href = "/membership"}
                    className="font-body font-bold text-slate-400 hover:text-slate-600 px-4 py-3 transition-colors text-sm"
                  >
                    キャンセルして戻る
                  </button>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button
                      onClick={handlePayment}
                      disabled={!isPayable}
                      className={`
                        btn-push relative w-full md:w-64 h-14 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 transition-all
                        ${isPayable 
                          ? 'bg-[#5fbb4e] text-white shadow-[0_4px_0_#469e38] hover:bg-[#4ea540] translate-y-0' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }
                      `}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <span>{(agreements.terms && agreements.discordRole) ? "Stripeで決済する" : "同意が必要"}</span>
                          <ArrowRight size={20} strokeWidth={3} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>

      <Footer onScrollTop={() => window.scrollTo(0, 0)} />

      {/* Error Modal Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setError(null)}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(event) => event.stopPropagation()}
               className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
             >
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle size={32} />
               </div>
               <h3 className="font-display font-bold text-xl text-slate-800 mb-2">エラー</h3>
               <p className="font-body text-slate-600 mb-6">{error}</p>
               <button 
                 onClick={() => setError(null)}
                 className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
               >
                 閉じる
               </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

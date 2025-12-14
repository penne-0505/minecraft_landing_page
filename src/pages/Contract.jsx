import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ShieldCheck, 
  Users, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
} from "lucide-react";
import { trackEvent, captureError } from "../analytics";
import { PLANS } from "../constants/plans";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InteractiveClover from "../components/ui/InteractiveClover";

const CheckboxCard = ({ 
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
      />
    </div>
  </div>
);

export default function Contract() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");

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
    discordRole: true,
    publicListing: true,
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
      const timer = setTimeout(() => {
        beginDiscordLogin();
        setOauthRedirecting(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, planParam]);

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePayment = async () => {
    if (!user || !planParam || !agreements.terms) return;
    
    setIsLoading(true);
    trackEvent("checkout_start", { priceType: planParam });

    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceType: planParam,
          discord_user_id: user.id,
          consent_display: agreements.publicListing,
          consent_roles: agreements.discordRole,
          consent_terms: agreements.terms,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        captureError(new Error("Checkout create failed"), { priceType: planParam, text });
        setError("決済セッションの作成に失敗しました。");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      captureError(err, { stage: "checkout_start_contract", priceType: planParam });
      setError("ネットワークエラーが発生しました。");
      setIsLoading(false);
    }
  };

  // Map PLANS to UI format
  const planInfo = PLANS[planParam] || {};
  const planDetails = {
    name: planInfo.label ? `${planInfo.label} Plan` : "Unknown Plan",
    price: `¥${planInfo.price?.toLocaleString()}`,
    interval: planInfo.unit ? `/${planInfo.unit}` : "",
    features: ["Priority Login", "Supporter Chat", "Cosmetic items"], // Fallback if not in PLANS
    // Styling mapping
    color: planParam === "one_month" ? "from-lime-200 to-lime-100" : (planParam === "sub_yearly" ? "from-teal-200 to-teal-100" : "from-[#a7f3d0] to-[#d1fae5]"),
    borderColor: planParam === "one_month" ? "border-lime-300" : (planParam === "sub_yearly" ? "border-teal-300" : "border-[#6ee7b7]"),
    badgeColor: planParam === "one_month" ? "text-lime-700 bg-lime-100" : (planParam === "sub_yearly" ? "text-teal-700 bg-teal-100" : "text-emerald-700 bg-emerald-100"),
  };

  const isPayable = agreements.terms && !isLoading;

  if (!user) {
    return (
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
                {oauthRedirecting ? "Discord 認証へ移動しています..." : "ページを準備しています..."}
              </p>
            </>
          )}
        </div>
      </div>
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
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#5fbb4e]/30 text-slate-800 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .btn-push:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>

      <Header 
        isLoggedIn={true} 
        user={user} 
        onLogin={() => {}} 
        onLogout={() => { localStorage.removeItem("discord_user"); setUser(null); }} 
        onScrollTop={() => window.scrollTo(0, 0)} 
      />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Title */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12 text-center md:text-left"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Confirm your support
            </h1>
            <p className="font-body text-slate-500 font-bold">
              Final step before payment. No money is charged yet.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            
            {/* Left Col: Plan Card */}
            <motion.div variants={itemVariants} className="lg:col-span-5 order-2 lg:order-1">
              <div className="sticky top-28">
                <div className={`relative overflow-hidden rounded-[24px] bg-white border-2 ${planDetails.borderColor} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]`}>
                  <div className={`h-32 bg-gradient-to-br ${planDetails.color} p-6 flex flex-col justify-between relative`}>
                    <div className="absolute -left-3 bottom-0 w-6 h-6 bg-[#f8fafc] rounded-full" />
                    <div className="absolute -right-3 bottom-0 w-6 h-6 bg-[#f8fafc] rounded-full" />
                    
                    <span className={`self-start px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${planDetails.badgeColor}`}>
                      Selected Plan
                    </span>
                    <div className="text-right">
                       <InteractiveClover />
                    </div>
                  </div>

                  <div className="p-8 pt-6 bg-white relative">
                    <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-slate-200"></div>

                    <h2 className="font-display text-2xl font-bold text-slate-800 mb-1">
                      {planDetails.name}
                    </h2>
                    <div className="flex items-baseline mb-6">
                      <span className="font-display text-4xl font-black text-slate-900 tracking-tight">
                        {planDetails.price}
                      </span>
                      <span className="font-body text-slate-400 font-bold ml-1 text-sm">
                        {planDetails.interval}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {planDetails.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-600 font-body font-bold text-sm">
                          <div className="w-5 h-5 rounded-full bg-[#ecfdf5] flex items-center justify-center shrink-0">
                            <Check size={12} className="text-[#059669]" strokeWidth={3} />
                          </div>
                          {feat}
                        </div>
                      ))}
                    </div>

                    {/* User Context */}
                    <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-slate-100">
                      <img 
                        src={user.avatar || "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full bg-white shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Account</span>
                        <span className="font-display font-bold text-slate-700">{user.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Col: Agreements & Action */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              
              {/* Agreements Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="text-[#5fbb4e]" />
                  Permissions & Terms
                </h3>
                
                <div className="flex flex-col gap-4">
                  <CheckboxCard 
                    checked={agreements.discordRole}
                    onChange={() => toggleAgreement('discordRole')}
                    icon={<Users size={20} />}
                    title="Grant Discord Role"
                    description="Automatically give you the Supporter role on our Discord server."
                    tag="Recommended"
                  />

                  <CheckboxCard 
                    checked={agreements.publicListing}
                    onChange={() => toggleAgreement('publicListing')}
                    icon={<InteractiveClover />}
                    title="Show on Leaderboard"
                    description={
                      agreements.publicListing 
                      ? "Your name will be listed on the public supporters page."
                      : "You will be listed as 'Anonymous Supporter'."
                    }
                  />

                  <div className="pt-2">
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
                            Accept Terms of Service
                          </span>
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Required
                          </span>
                        </div>
                        <div className="font-body text-slate-500 text-sm leading-relaxed">
                          I agree to the <a href="/legal/terms" className="text-[#5fbb4e] underline hover:text-[#469e38]" onClick={(e) => e.stopPropagation()}>Terms of Service</a> and <a href="/legal/privacy" className="text-[#5fbb4e] underline hover:text-[#469e38]" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>. I understand this is a digital goods purchase.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Actions Section */}
              <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200">
                <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center justify-between">
                  <button 
                    onClick={() => window.location.href = "/membership"}
                    className="font-body font-bold text-slate-400 hover:text-slate-600 px-4 py-3 transition-colors text-sm"
                  >
                    Cancel & Return
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
                          <span>Pay with Stripe</span>
                          <ArrowRight size={20} strokeWidth={3} />
                        </>
                      )}
                    </button>
                    {!agreements.terms && (
                      <p className="text-center md:text-right text-xs font-bold text-orange-400 mt-2">
                        * Please accept the terms to proceed
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                   <a href="/help" className="text-xs font-bold text-slate-400 hover:text-[#5865F2] transition-colors inline-flex items-center gap-1">
                     <AlertCircle size={12} />
                     Having trouble? Visit Help Center
                   </a>
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
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
             >
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle size={32} />
               </div>
               <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Error</h3>
               <p className="font-body text-slate-600 mb-6">{error}</p>
               <button 
                 onClick={() => setError(null)}
                 className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
               >
                 Dismiss
               </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
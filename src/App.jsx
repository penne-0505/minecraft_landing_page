import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Legal from "./pages/Legal.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Join from "./pages/Join.jsx";
import Contract from "./pages/Contract.jsx";

const App = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("discord_user");
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });
  const isLoggedIn = !!(user && user.id);
  const [checkoutStatus, setCheckoutStatus] = useState(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("checkout");
    return status === "success" || status === "cancel" ? status : null;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "https://tutos-gameserver.fr/wp-content/uploads/2020/03/1585011128_75-1024x576.jpg",
    "https://images.immediate.co.uk/production/volatile/sites/3/2021/05/shader-minecraft-water-bd32d30.png",
    "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/04/best-minecraft-shaders-solas-aurora.jpg",
    "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/04/minecraft-shaders-unreal.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const handleLogout = () => {
    localStorage.removeItem("discord_user");
    setUser(null);
  };

  const appBaseUrl =
    import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const redirectUriClient =
    import.meta.env.VITE_DISCORD_REDIRECT_URI || `${appBaseUrl}/auth/callback`;

  // OAuth callback handling
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    // clear checkout param to avoid stale banner after OAuth redirect
    url.searchParams.delete("checkout");

    // prevent duplicate calls
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    const cleanUrl = url.toString();
    window.history.replaceState({}, "", cleanUrl);

    (async () => {
      try {
        const res = await fetch("/discord-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) {
          console.error("OAuth exchange failed", await res.text());
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
        }
      } catch (err) {
        console.error("OAuth error", err);
      }
    })();
  }, []);

  const beginDiscordLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
      response_type: "code",
      scope: "identify guilds.join",
      redirect_uri: redirectUriClient,
      prompt: "consent",
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  const startCheckout = async (priceType) => {
    if (!user) {
      beginDiscordLogin();
      return;
    }
    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceType,
          discord_user_id: user.id,
        }),
      });
      if (!res.ok) {
        console.error("Checkout create failed", await res.text());
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error", err);
    }
  };

  const displayUser = user ?? {
    id: "guest",
    name: "Guest",
    discriminator: "0000",
    avatar:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg",
  };

  const dismissCheckoutStatus = () => setCheckoutStatus(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans selection:bg-[#5fbb4e] selection:text-white overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
        
        .soft-shadow {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 15px -3px rgba(50, 60, 90, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
        }
        
        .glass-header {
          background: rgba(255, 255, 255, 0.60);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        .btn-push {
          transition: transform 0.08s cubic-bezier(0.3, 0, 0.5, 1), box-shadow 0.08s cubic-bezier(0.3, 0, 0.5, 1);
        }
        .btn-push:active {
          transform: translateY(4px) !important;
          box-shadow: 0 0 0 transparent !important;
        }

        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(12deg); }
          100% { transform: translateX(150%) skewX(12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .text-glow {
          text-shadow: 0 0 20px rgba(95, 187, 78, 0.5);
        }
      `}</style>

      <nav className="fixed top-0 w-full z-50 h-16 md:h-20 flex items-center glass-header shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <motion.button
            onClick={scrollToTop}
            className="flex items-baseline gap-2 group cursor-pointer text-left focus:outline-none"
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg md:text-xl font-extrabold tracking-tight brand-font text-slate-700 transition-colors duration-300 group-hover:text-[#5fbb4e]">
              Minecraft Server <InteractiveClover />
            </span>
            <span className="text-[#5fbb4e] font-black text-xs uppercase tracking-wide hidden sm:inline-block bg-[#5fbb4e]/10 px-2 py-0.5 rounded-full border border-[#5fbb4e]/20 group-hover:bg-[#5fbb4e]/20 transition-colors">
              Supporters
            </span>
          </motion.button>

          <div>
            {!isLoggedIn ? (
              <div className="flex flex-col items-end">
                <motion.button
                  onClick={beginDiscordLogin}
                  whileHover={{ scale: 1.05, backgroundColor: "#4752C4" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5865F2] text-white font-bold text-sm btn-push flex items-center justify-center gap-2 shadow-[0_4px_0_#4752C4] transition-all duration-300 px-5 py-2.5 rounded-xl"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ac.svg"
                    className="w-5 h-5 invert brightness-0 shrink-0"
                    alt=""
                  />
                  <span className="whitespace-nowrap">Discordでログイン</span>
                </motion.button>
              </div>
            ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-colors bg-slate-100 border-slate-200"
                >
                  <img
                    src={
                      (user?.avatar ||
                      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
                    )}
                    alt="User"
                    className="w-8 h-8 rounded-full bg-white shadow-sm"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold text-slate-700">
                      {user?.name ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Login as #{user?.discriminator ?? "0000"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </motion.div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 md:pt-24 pb-12">
        {checkoutStatus && (
          <div className="container mx-auto px-4 md:px-6 mb-6">
            <div
              className={`rounded-xl px-4 py-3 shadow-md border flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${
                checkoutStatus === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {checkoutStatus === "success" ? (
                  <Check className="text-emerald-600" size={20} />
                ) : (
                  <HelpCircle className="text-amber-600" size={20} />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-sm">
                    {checkoutStatus === "success"
                      ? "決済が完了しました！"
                      : "決済がキャンセルされました"}
                  </span>
                  <span className="text-xs md:text-sm">
                    {checkoutStatus === "success"
                      ? "ロール付与は数秒〜1分ほどで反映されます。Discordで付与を確認してください。"
                      : "もう一度購入する場合は、下のプランから再開できます。"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {checkoutStatus === "success" ? (
                  <a
                    href="https://discord.com/channels/@me"
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    Discordを開く
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      dismissCheckoutStatus();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-2 rounded-lg bg-white border text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    プランを再選択
                  </button>
                )}
                <button
                  onClick={dismissCheckoutStatus}
                  className="px-3 py-2 rounded-lg bg-transparent border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="container mx-auto px-4 md:px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 aspect-[4/5] md:aspect-[21/9] min-h-[600px] flex items-center justify-center group"
          >
            <div className="absolute inset-0 z-0">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  style={{
                    backgroundImage: `url('${heroImages[currentImageIndex]}')`,
                  }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            <div className="relative z-10 text-center flex flex-col justify-center items-center w-full px-4 transform translate-y-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
                  },
                }}
                className="max-w-4xl mx-auto space-y-8 w-full"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: "easeOut" },
                    },
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-snug drop-shadow-2xl tracking-tight"
                >
                  <span className="inline-block">いつもの場所を、</span>
                  <br className="md:hidden" />
                  <span className="text-[#5fbb4e] text-glow inline-block md:ml-4">
                    ほんの少し特別に。
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: "easeOut" },
                    },
                  }}
                  className="text-sm md:text-base text-slate-100 font-bold leading-relaxed max-w-lg mx-auto drop-shadow-md"
                >
                  サーバーの維持と、新しい遊びの創造へ。
                  <br className="hidden md:inline" />
                  あなたの支援が、この世界を次の季節へと進めます。
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: "easeOut" },
                    },
                  }}
                  className="pt-6"
                >
                  <motion.a
                    href="#pricing"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-[#5fbb4e] hover:bg-[#4ea540] text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-lg md:text-xl btn-push shadow-[0_5px_0_#469e38] active:shadow-none active:translate-y-[5px] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl pointer-events-none"></span>
                    <HeartHandshake className="w-6 h-6 md:w-7 md:h-7" />
                    支援プランを見る
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>

            <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 pointer-events-none"></div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 pointer-events-none">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ChevronDown size={28} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="w-full relative z-20 mb-20 overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#f0f9ff] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#f0f9ff] to-transparent z-10 pointer-events-none" />

          <div className="container mx-auto px-4 mb-4">
            <p className="text-center text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Recent Supporters
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </p>
          </div>
          <SupporterTicker />
        </section>

        <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-12 max-w-5xl mb-24">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              その名前が、
              <br />
              <span className="text-[#5865F2]">信頼の証になる。</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed text-sm">
              サポーターの証である「限定カラー」と「ロール」は、単なる装飾ではありません。
              <br />
              <br />
              それは、あなたがこのコミュニティを愛し、支えていることの表明です。開発裏話が聞ける限定チャンネルで、運営と一緒に次の企画を考えませんか？
            </p>
            <div className="flex gap-2 justify-center md:justify-start">
              <motion.span
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(95, 187, 78, 0.2)",
                }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#5fbb4e]/10 text-[#5fbb4e] text-xs font-bold cursor-default"
              >
                <Crown size={14} className="mr-1" /> ロール付与
              </motion.span>
              <motion.span
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(88, 101, 242, 0.2)",
                }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold cursor-default"
              >
                <Users size={14} className="mr-1" /> 限定チャンネル
              </motion.span>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center">
                <DiscordMemberListMock user={displayUser} />
          </div>
        </section>

        <section id="pricing" className="py-12 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-10">
              <span className="text-[#5fbb4e] font-black tracking-widest uppercase text-sm mb-3 block">
                Supporter Plans
              </span>

              <CommunityGoalWidget />

              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                支援の方法を選ぶ
              </h2>
            </div>

            <PricingComponent />

            <div className="text-center mt-10 text-xs text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
              ※ すべてのプランで特典内容は同じです。適用期間のみが異なります。
              <br />
              ※ 決済はStripeを通じて安全に行われます。
              <br />
              <span className="opacity-70">
                ※ 返金ポリシーについては、規約をご確認ください。
              </span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center flex items-center justify-center gap-2">
            <HelpCircle className="text-[#5fbb4e]" /> よくある質問
          </h2>
          <div className="space-y-4">
            <FAQItem
              q="クレジットカードがなくても支払えますか？"
              a="はい、Vプリカやバンドルカードなどのプリペイドカード、またはデビットカードがご利用いただけます。"
            />
          }
        />
        <Route
          path="/community"
          element={
            <Placeholder
              title="Join / Community LP"
              description="コミュニティ誘導用の独立LPを近日公開予定です。"
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

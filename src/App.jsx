import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  HeartHandshake,
  HelpCircle,
  Leaf,
  LogOut,
  Users,
} from "lucide-react";

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
            <FAQItem
              q="特典はいつ反映されますか？"
              a="決済完了後、通常5分以内にDiscordおよびゲーム内に自動反映されます。Discord連携が済んでいることをご確認ください。"
            />
            <FAQItem
              q="解約はいつでもできますか？"
              a="はい、月額プランはDiscordのマイページ、または当サイトからいつでも解約可能です。解約後も、支払い済みの期間は特典が継続します。"
            />
            <FAQItem
              q="集まった資金は何に使われますか？"
              a="100%がサーバーの維持費（レンタルサーバー代など）に充てられます。余剰分が出た場合は、イベントの賞品などに還元されます。"
            />
          </div>
        </section>

        <footer className="bg-white border-t border-slate-200 py-12 mt-12">
          <div className="container mx-auto px-4 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 opacity-80">
              <span
                className="font-bold text-slate-700 brand-font text-lg cursor-pointer select-none"
                onClick={scrollToTop}
              >
                Minecraft Server <InteractiveClover />
              </span>
            </div>
            <div className="flex justify-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-slate-400 flex-wrap">
              <FooterLink href="#">特定商取引法に基づく表記</FooterLink>
              <FooterLink href="#">プライバシーポリシー</FooterLink>
              <FooterLink href="#">運営者情報</FooterLink>
            </div>
            <div className="text-xs text-slate-300 font-bold">
              &copy; 2025 Minecraft Server 🍀 Not affiliated with Mojang or Microsoft.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const InteractiveClover = () => (
  <motion.span
    className="text-xl md:text-2xl ml-1 inline-block cursor-pointer select-none"
    whileHover={{
      rotate: [0, 15, -15, 10, -10, 0],
      transition: { duration: 0.5 },
    }}
    whileTap={{ scale: 0.7 }}
    transition={{ type: "spring", stiffness: 400, damping: 12 }}
  >
    🍀
  </motion.span>
);

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="relative group text-slate-400 hover:text-slate-600 transition-colors"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-300 group-hover:w-full" />
  </a>
);

const CommunityGoalWidget = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.02,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }}
    className="bg-white border border-slate-200 rounded-full p-1.5 pr-6 mb-6 flex items-center gap-4 soft-shadow cursor-default group"
  >
    <div className="flex items-center pl-1 relative">
      {[
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sudo",
      ].map((src, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative z-0 shadow-sm"
          style={{ marginLeft: i === 0 ? 0 : -12 }}
        >
          <img src={src} className="w-full h-full object-cover" alt="" />
        </div>
      ))}
      <div
        className="w-8 h-8 rounded-full border-2 border-white bg-[#5fbb4e] flex items-center justify-center text-white text-[10px] font-black relative z-10 shadow-sm"
        style={{ marginLeft: -12 }}
      >
        +42
      </div>
    </div>

    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
          今月の維持費ゴール
        </span>
        <span className="text-xs font-black text-[#5fbb4e]">78%</span>
      </div>
      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "78%" }}
          viewport={{ once: true }}
          className="h-full bg-[#5fbb4e] rounded-full"
        />
      </div>
    </div>
  </motion.div>
);

const SupporterTicker = () => {
  const supporters = [
    { name: "CraftMaster_99", plan: "Monthly" },
    { name: "Yuki_Builder", plan: "Yearly" },
    { name: "Tanaka.T", plan: "Ticket" },
    { name: "Steve_Jobs", plan: "Yearly" },
    { name: "Miner_Alex", plan: "Monthly" },
    { name: "CreeperLover", plan: "Monthly" },
    { name: "RedstonePro", plan: "Yearly" },
    { name: "DiamondHunter", plan: "Ticket" },
  ];

  const getPlanStyle = (plan) => {
    switch (plan) {
      case "Ticket":
        return "text-lime-600 bg-lime-100 border-lime-200";
      case "Yearly":
        return "text-teal-600 bg-teal-100 border-teal-200";
      case "Monthly":
      default:
        return "text-[#5fbb4e] bg-[#5fbb4e]/10 border-green-200";
    }
  };

  const loopSupporters = [...supporters, ...supporters];

  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        className="flex gap-4 md:gap-6 pr-4 md:pr-6"
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        whileHover={{ animationPlayState: "paused" }}
        style={{ width: "max-content" }}
      >
        {loopSupporters.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 px-5 py-2.5 rounded-full shadow-sm whitespace-nowrap min-w-[200px] cursor-default transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
              {s.name[0]}
            </div>
            <div className="flex flex-col justify-center leading-none">
              <div className="text-sm font-bold text-slate-700 mb-1">{s.name}</div>
              <div
                className={`text-[9px] font-bold uppercase px-1.5 py-[2px] rounded border w-fit ${getPlanStyle(
                  s.plan
                )}`}
              >
                {s.plan}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const DiscordMemberListMock = ({ user }) => (
  <motion.div
    whileHover={{
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(100, 100, 100, 0.5)",
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-64 bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#1e1f22] font-sans"
  >
    <div className="bg-[#2b2d31] p-3 border-b border-[#1e1f22] flex items-center justify-between">
      <span className="text-[#f2f3f5] font-bold text-xs"># general</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#1e1f22]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1e1f22]"></div>
      </div>
    </div>

    <div className="p-3 bg-[#313338]">
      <div className="text-[#949ba4] text-[11px] font-bold uppercase tracking-wide mb-2 px-1 hover:text-[#dbdee1] transition-colors cursor-default">
        Supporters — 1
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, x: -10 }}
        whileInView={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
        className="flex items-center gap-3 p-1.5 rounded cursor-pointer group relative"
      >
        <div className="relative">
          <img
            src={
              user?.avatar ||
              "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
            }
            className="w-8 h-8 rounded-full bg-slate-200"
            alt=""
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#313338] rounded-full p-[3px]">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div>
          <div className="text-[#5fbb4e] font-medium text-sm group-hover:underline flex items-center gap-1">
            {user?.name ?? "Guest"}
            <Crown
              size={12}
              className="fill-current text-[#ffcc00] stroke-[#ffcc00] stroke-[1px]"
            />
          </div>
          <div className="text-[11px] text-[#949ba4]">Playing Minecraft</div>
        </div>
      </motion.div>

      <div className="mt-4 opacity-50">
        <div className="text-[#949ba4] text-[11px] font-bold uppercase tracking-wide mb-2 px-1">
          Members — 3
        </div>
        {["Steve", "Alex", "Zombie"].map((name, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
            className="flex items-center gap-3 p-1.5 rounded cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
              {name[0]}
            </div>
            <div>
              <div className="text-[#dbdee1] text-sm font-medium">{name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const PricingComponent = () => {
  const [cycle, setCycle] = useState("monthly");

  const plans = {
    ticket: {
      price: 300,
      unit: "回",
      desc: "気軽にサーバーを支援",
      label: "Ticket",
      textColor: "text-lime-600",
      bgColor: "bg-lime-500",
      hoverBgColor: "hover:bg-lime-600",
      borderColor: "border-lime-200",
      iconBg: "bg-lime-500",
      shadowStyle: "shadow-[0_5px_0_#65a30d]",
    },
    monthly: {
      price: 300,
      unit: "月",
      desc: "継続的なサポート",
      label: "Monthly",
      textColor: "text-[#5fbb4e]",
      bgColor: "bg-[#5fbb4e]",
      hoverBgColor: "hover:bg-[#4ea540]",
      borderColor: "border-green-200",
      iconBg: "bg-[#5fbb4e]",
      shadowStyle: "shadow-[0_5px_0_#469e38]",
    },
    yearly: {
      price: 3000,
      unit: "年",
      desc: "１年分をまとめてお得に",
      label: "Yearly",
      textColor: "text-teal-600",
      bgColor: "bg-teal-600",
      hoverBgColor: "hover:bg-teal-700",
      borderColor: "border-teal-200",
      iconBg: "bg-teal-600",
      shadowStyle: "shadow-[0_5px_0_#0d9488]",
    },
  };

  const currentPlan = plans[cycle];
  const planKeys = ["ticket", "monthly", "yearly"];

  const handleDragEnd = (_event, info) => {
    const threshold = 50;
    const currentIndex = planKeys.indexOf(cycle);
    const offset = info.offset.x;

    if (offset < -threshold && currentIndex < planKeys.length - 1) {
      setCycle(planKeys[currentIndex + 1]);
    } else if (offset > threshold && currentIndex > 0) {
      setCycle(planKeys[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-100 p-1.5 rounded-2xl flex relative mb-8">
        <div
          className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
          style={{
            left:
              cycle === "ticket"
                ? "0.375rem"
                : cycle === "monthly"
                ? "33.33%"
                : "calc(66.66% - 0.375rem)",
            width: "calc(33.33% - 0.25rem)",
          }}
        />
        {["ticket", "monthly", "yearly"].map((c) => (
          <button
            key={c}
            onClick={() => setCycle(c)}
            className={`flex-1 relative z-10 py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
              cycle === c ? plans[c].textColor : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:hidden text-slate-300 animate-pulse pointer-events-none z-20">
          <ChevronLeft size={36} strokeWidth={3} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:hidden text-slate-300 animate-pulse pointer-events-none z-20">
          <ChevronRight size={36} strokeWidth={3} />
        </div>

        <motion.div
          key={cycle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderColor:
              cycle === "monthly"
                ? "#86efac"
                : cycle === "yearly"
                ? "#5eead4"
                : "#bef264",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ touchAction: "pan-y" }}
          className={`bg-white border-2 rounded-[2.5rem] p-8 soft-shadow relative overflow-hidden transition-colors duration-300 ${currentPlan.borderColor} cursor-grab active:cursor-grabbing z-10`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Leaf
              size={120}
              className={currentPlan.textColor.replace("text-", "text-opacity-50 text-")}
            />
          </div>

          <div className="mb-8 select-none">
            <div
              className={`font-bold text-sm uppercase tracking-wider mb-2 opacity-60 ${currentPlan.textColor}`}
            >
              {currentPlan.label} Plan
            </div>
            <div className="flex items-baseline gap-1 text-slate-800">
              <span className="text-2xl font-bold">¥</span>
              <span
                className={`text-6xl font-black tracking-tight brand-font ${currentPlan.textColor}`}
              >
                {currentPlan.price.toLocaleString()}
              </span>
              <span className="text-slate-400 font-bold">/ {currentPlan.unit}</span>
            </div>
            <p className="text-slate-500 mt-2 font-bold text-sm">{currentPlan.desc}</p>
          </div>

          <ul className="space-y-4 mb-8 select-none">
            {["サポーター限定Discordロール", "ゲーム内ネームカラー変更", "限定チャンネルへのアクセス"].map(
              (feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-bold text-sm group/item"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${currentPlan.iconBg} group-hover/item:scale-110 transition-transform`}
                  >
                    <Check size={12} strokeWidth={4} />
                  </div>
                  {feature}
                </li>
              )
            )}
          </ul>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-white py-4 rounded-2xl font-bold text-lg btn-push flex justify-center items-center gap-2 group transition-colors duration-300 ${currentPlan.bgColor} ${currentPlan.hoverBgColor} ${currentPlan.shadowStyle} active:shadow-none active:translate-y-[5px]`}
          >
            このプランで支援する{" "}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      <div className="md:hidden flex justify-center gap-2 mt-6">
        {planKeys.map((k) => (
          <div
            key={k}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              cycle === k ? "bg-slate-400 scale-125" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const labelId = useId();
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <motion.button
        whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={contentId}
        type="button"
      >
        <span id={labelId}>{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </motion.button>
      <motion.div
        id={contentId}
        role="region"
        aria-labelledby={labelId}
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="border-t border-slate-50 bg-slate-50/50 overflow-hidden"
      >
        <div className="p-4 text-sm font-medium text-slate-500 leading-relaxed">{a}</div>
      </motion.div>
    </div>
  );
};

export default App;

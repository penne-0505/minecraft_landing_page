import React, { useEffect, useState } from 'react';
import { MessageCircle, Calendar, Map, X, ArrowRight, Flag, Camera, BookOpen, Crown, Gem, Hammer, Coffee, Wand2, PartyPopper, Sun, Sparkles, Ticket, Check, Mic, Phone, Quote, Clover, Sprout, Castle, Pickaxe } from 'lucide-react';
import { joinImages, galleryImages } from '../data/lpImages';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Seo from "../components/Seo";
import { getSiteDefaults, normalizeUrl } from "../utils/seo";
import discordIcon from '../assets/icons/Discord-Symbol-White.svg';

// --- Design Tokens & Constants ---
const TOKENS = {
  colors: {
    brand: {
      50: '#ecfdf5',
      100: '#d1fae5',
      400: '#5fbb4e',
      500: '#4ea540',
      shadow: '#469e38', 
      dark: '#15803d',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f0f9ff',
      200: '#e2e8f0',
      800: '#1e293b',
      500: '#64748b',
    },
    discord: {
      base: '#5865F2',
      dark: '#4752C4',
    }
  },
  shadows: {
    soft: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05), inset 0 1px 0 rgba(255,255,255,1)',
    push: (color) => `0 4px 0 ${color}`,
  }
};

const JOIN_LANDING_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700;900&family=Zen+Kurenaido&display=swap";

const ensureJoinLandingFonts = () => {
  if (typeof document === "undefined") return;
  const existing = document.querySelector('link[data-join-landing-fonts="true"]');
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = JOIN_LANDING_FONTS_HREF;
  link.setAttribute("data-join-landing-fonts", "true");
  document.head.appendChild(link);
};

const IMAGE_SIZES = {
  heroMain: "(max-width: 768px) 80vw, 320px",
  heroRight: "(max-width: 768px) 45vw, 224px",
  heroLeft: "(max-width: 768px) 45vw, 240px",
  memoryWide: "(max-width: 768px) 85vw, (max-width: 1024px) 66vw, 66vw",
  memoryTall: "(max-width: 768px) 85vw, (max-width: 1024px) 33vw, 33vw",
  memoryStd: "(max-width: 768px) 85vw, (max-width: 1024px) 33vw, 33vw",
  ctaRight: "192px",
  ctaLeft: "160px",
  ctaOverlay: "100vw",
};

const normalizeDiscordInviteUrl = (rawUrl) => {
  if (!rawUrl) {
    return "";
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const DISCORD_INVITE_URL = normalizeDiscordInviteUrl(import.meta.env.VITE_DISCORD_INVITE_URL);
const HAS_DISCORD_INVITE_URL = DISCORD_INVITE_URL.length > 0;

const handleMissingDiscordInvite = (event) => {
  event?.preventDefault?.();
  if (typeof window !== "undefined") {
    window.alert("Discord招待URLの設定が未完了です。時間を置いて再度お試しください。");
  }
};

// --- Helper Components ---

const Button = ({ children, variant = 'primary', className = '', href, ...props }) => {
  const baseStyle = "relative inline-flex items-center justify-center font-bold transition-all duration-150 active:translate-y-[4px] active:shadow-none outline-none focus-visible:ring-4 focus-visible:ring-offset-2";
  
  const variants = {
    primary: `bg-[#5fbb4e] text-white hover:bg-[#4ea540] focus-visible:ring-[#5fbb4e]/40 rounded-xl`,
    discord: `bg-[#5865F2] text-white hover:bg-[#4752C4] focus-visible:ring-[#5865F2]/40 rounded-xl`,
    ghost: `bg-transparent text-[#64748b] hover:text-[#1e293b] hover:bg-slate-100 shadow-none rounded-lg active:translate-y-0`,
    white: `bg-white text-[#5fbb4e] hover:bg-gray-50 focus-visible:ring-white/40 rounded-xl border-2 border-transparent`
  };

  const shadowColor = variant === 'primary' ? '#469e38' : variant === 'discord' ? '#3d46a8' : variant === 'white' ? '#e2e8f0' : 'transparent';
  const shadowStyle = variant !== 'ghost' ? { boxShadow: `0 4px 0 ${shadowColor}` } : {};

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyle} ${variants[variant]} ${className}`}
        style={shadowStyle}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      style={shadowStyle}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', delay = 0 }) => {
  return (
    <div 
      className={`bg-white rounded-3xl border border-[#e2e8f0] hover:-translate-y-1 transition-transform duration-300 ${className}`}
      style={{ 
        boxShadow: TOKENS.shadows.soft,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const PhotoFrame = ({
  caption,
  image,
  sizes,
  loading = "lazy",
  fetchPriority,
  rotate = 'rotate-0',
  delay = 0,
  className = '',
}) => (
  <div 
    className={`bg-white p-2 md:p-3 pb-6 md:pb-8 rounded shadow-lg transform transition-[transform,box-shadow] hover:scale-105 hover:z-10 duration-500 ${rotate} ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="bg-slate-200 w-full aspect-[4/3] rounded-sm overflow-hidden relative mb-2 md:mb-3 group">
      {image?.src ? (
        <img 
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          width={image.width}
          height={image.height}
          loading={loading}
          decoding="async"
          fetchpriority={fetchPriority}
          alt={caption || ""} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 ${image?.src ? 'hidden' : 'flex'}`}>
        <Camera className="w-8 h-8 opacity-20" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
    {caption && (
      <div className="text-center font-polaroid-caption text-slate-500 text-sm md:text-lg rotate-[-1deg]">
        {caption}
      </div>
    )}
  </div>
);

const Badge = ({ children, color = 'brand' }) => {
  const styles = {
    brand: "bg-[#ecfdf5] text-[#15803d]",
    discord: "bg-[#e0e7ff] text-[#3730a3]",
    amber: "bg-[#fffbeb] text-[#b45309]",
    rose: "bg-[#fff1f2] text-[#be123c]",
    blue: "bg-[#eff6ff] text-[#1d4ed8]",
    purple: "bg-purple-50 text-purple-700",
    dark: "bg-slate-800 text-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${styles[color]}`}>
      {children}
    </span>
  );
};

// --- Sections ---

const Hero = () => {
  const [activeHeroPhoto, setActiveHeroPhoto] = useState(null);

  const handleHeroPointerDown = (id) => (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    event.stopPropagation();
    setActiveHeroPhoto(id);
  };

  const handleHeroBackgroundPointerDown = (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    setActiveHeroPhoto(null);
  };

  const getHeroZIndex = (id, base) => (activeHeroPhoto === id ? "z-40" : base);

  return (
    <section id="header" className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#eefdf6] to-white" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 text-center md:text-left pt-4 md:pt-0">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#5fbb4e] uppercase mt-3 mb-2">Since 2019</h3>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1e293b] tracking-tight mt-3 mb-4 md:mb-6">
            あなたらしく<br/>遊べる場所が、<br/>
            <span className="text-[#5fbb4e]">ここにある。</span>
          </h1>
          <p className="font-body text-[#64748b] text-base md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0 mb-6 md:mb-8">
            建築に没頭する人、冒険を楽しむ人、<br/>
            雑談で夜を過ごす人。<br/>
            900名が集まるこのサーバーでは、<br/>
            どんな遊び方も、自然に共存しています。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mt-4">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg shadow-lg hover:shadow-xl" href="#join">
              <Flag className="w-5 h-5 mr-2" />
              参加する
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-[#64748b]" href="#memories">
              ギャラリーを見る <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        <div className="md:col-span-6 relative h-[360px] md:h-[500px] w-full perspective-1000 mt-8 md:mt-0">
           <div
             className="absolute inset-0 flex items-center justify-center"
             onPointerDown={handleHeroBackgroundPointerDown}
           >
              {/* Main Image */}
              <div
                className={`absolute ${getHeroZIndex("main", "z-30")} transform -rotate-2 hover:rotate-0 transition-transform duration-500 w-64 md:w-80`}
                onPointerDown={handleHeroPointerDown("main")}
              >
                <PhotoFrame
                  caption="花見イベント '24"
                  image={joinImages.heroMain}
                  sizes={IMAGE_SIZES.heroMain}
                  loading="eager"
                  fetchPriority="high"
                  rotate="rotate-0"
                  className={activeHeroPhoto === "main" ? "scale-105 !shadow-2xl" : ""}
                />
              </div>
              {/* Right Floater */}
              <div
                className={`absolute top-0 right-0 md:-right-4 ${getHeroZIndex("right", "z-20")} transform rotate-6 w-36 md:w-56 animate-float-delayed`}
                onPointerDown={handleHeroPointerDown("right")}
              >
                <PhotoFrame
                  caption="ラクダだ！"
                  image={joinImages.heroRight}
                  sizes={IMAGE_SIZES.heroRight}
                  loading="lazy"
                  fetchPriority="low"
                  rotate="rotate-3"
                  className={activeHeroPhoto === "right" ? "scale-105 !shadow-2xl" : ""}
                />
              </div>
              {/* Left Floater */}
              <div
                className={`absolute bottom-4 left-0 md:-left-8 ${getHeroZIndex("left", "z-20")} transform -rotate-6 w-40 md:w-60 animate-float`}
                onPointerDown={handleHeroPointerDown("left")}
              >
                <PhotoFrame
                  caption="ふたりでブランコ"
                  image={joinImages.heroLeft}
                  sizes={IMAGE_SIZES.heroLeft}
                  loading="lazy"
                  fetchPriority="low"
                  rotate="-rotate-3"
                  className={activeHeroPhoto === "left" ? "scale-105 !shadow-2xl" : ""}
                />
              </div>

              {/* Decorative Icons - Hidden on very small screens to reduce clutter */}
              <div className="hidden sm:block absolute top-10 left-10 text-[#5fbb4e] opacity-20 transform -rotate-12 animate-pulse">
                <Clover size={48} />
              </div>
              <div className="hidden sm:block absolute bottom-20 right-10 text-[#f59e0b] opacity-20 transform rotate-12 animate-pulse">
                <Sprout size={48} />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const MemoryLane = () => {
  return (
    <section id="memories" className="py-20 bg-white relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] -right-[12%] w-[20rem] md:w-[36rem] h-[20rem] md:h-[36rem] bg-[#fff2e1] rounded-full mix-blend-multiply filter blur-3xl opacity-55 animate-blob" />
        <div className="absolute top-[34%] left-[4%] w-[16rem] md:w-[28rem] h-[16rem] md:h-[28rem] bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-45 animate-blob" style={{ animationDelay: '1.5s'}} />
        <div className="absolute left-1/2 top-1/2 w-[18rem] md:w-[30rem] h-[18rem] md:h-[30rem] bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '3s'}} />
        <div className="absolute -left-[12%] bottom-[6%] w-[22rem] md:w-[40rem] h-[22rem] md:h-[40rem] bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" style={{ animationDelay: '6s'}} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex justify-between items-end mb-16">
            <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#5fbb4e] uppercase mt-3 mb-2">Gallery</h3>
                <h2 className="text-3xl md:text-4xl font-display font-black text-[#1e293b] mt-3">サーバーの風景</h2>
            </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Col 1 */}
            <div className="space-y-8 md:space-y-12 mt-0 md:mt-12">
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/4]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column1[0].src}
                          srcSet={galleryImages.column1[0].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Landscape" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-sm shadow-sm border border-[#e2e8f0]">
                    <Quote className="w-6 h-6 text-[#5fbb4e] mb-4 opacity-50" />
                    <p className="font-display text-lg leading-relaxed text-[#1e293b] mb-4">
                        「このサーバーを一言で表すと、『ほかの人たちと気ままに楽しく、また自分の好きなことを自由にプレイできるサーバー』です。」
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          <span className="font-bold text-slate-400 text-base md:text-lg">m</span>
                        </div>
                        <span className="text-xs font-bold text-[#64748b]">maeji3</span>
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[4/3]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column1[1].src}
                          srcSet={galleryImages.column1[1].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Main hall" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/5]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column1[2].src}
                          srcSet={galleryImages.column1[2].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Night work" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-sm shadow-sm border border-[#e2e8f0]">
                    <Quote className="w-6 h-6 text-[#5fbb4e] mb-4 opacity-50" />
                    <p className="font-display text-lg leading-relaxed text-[#1e293b] mb-4">
                        「毎シーズン、楽しいイベントや面白い制度などがあって毎日飽きません。」
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          <span className="font-bold text-slate-400 text-base md:text-lg">k</span>
                        </div>
                        <span className="text-xs font-bold text-[#64748b]">kyoharakakuti</span>
                    </div>
                </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-8 md:space-y-12">
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[4/3]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column2[0].src}
                          srcSet={galleryImages.column2[0].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Night view" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-square">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column2[1].src}
                          srcSet={galleryImages.column2[1].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Square view" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-square">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column2[2].src}
                          srcSet={galleryImages.column2[2].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Gathering" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/4]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column2[3].src}
                          srcSet={galleryImages.column2[3].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Nature" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/4]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column2[4].src}
                          srcSet={galleryImages.column2[4].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Square view 2" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
            </div>

            {/* Col 3 */}
            <div className="space-y-8 md:space-y-12 mt-0 md:mt-24">
                 <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-square">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column3[0].src}
                          srcSet={galleryImages.column3[0].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Home" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/5]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column3[1].src}
                          srcSet={galleryImages.column3[1].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Structure" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-sm shadow-sm border border-[#e2e8f0]">
                    <Quote className="w-6 h-6 text-[#5fbb4e] mb-4 opacity-50" />
                    <p className="font-display text-lg leading-relaxed text-[#1e293b] mb-4">
                        「非常に快適。初心者におすすめできる鯖。スタッフさんも優しく、参加者へのサポートも充実しており快適です。」
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          <span className="font-bold text-slate-400 text-base md:text-lg">納</span>
                        </div>
                        <span className="text-xs font-bold text-[#64748b]">納豆巻き</span>
                    </div>
                </div>
                <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-sm shadow-xl aspect-[3/4]">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={galleryImages.column3[2].src}
                          srcSet={galleryImages.column3[2].srcSet}
                          sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" decoding="async"
                          alt="Riverside" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};


// --- Refined Feature Section (METAPHOR FOCUSED) ---

const RefinedFeatures = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-white overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute bottom-[10%] -right-[10%] w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" style={{ animationDelay: '4s'}} />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 space-y-24 md:space-y-32">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#5fbb4e] uppercase mt-3 mb-2">Why Choose Us?</h3>
          <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-[#1e293b] mt-3">
            選ばれる<br/>
            <span className="text-[#5fbb4e] inline-block transform bg-[#ecfdf5] px-2 md:px-4 py-1 rounded-lg border-2 border-[#5fbb4e]/20 mt-2">3 つの理由</span>
          </h2>
          <p className="text-[#64748b] font-body text-base md:text-xl leading-relaxed mt-4 md:mt-6">
            義務もノルマもありません。<br/>
            クランで繋がりを持つことも、一人で気ままに遊ぶことも。すべてはあなたの自由。<br/>
            私たちが用意するのは、選択肢と安心できる環境だけです。
          </p>
        </div>

        {/* --- METAPHOR 1: The "To-Do List" (Freedom) --- */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="relative group perspective-1000 px-2 md:px-0">
             {/* The Clipboard / Notepad Visual */}
             <div className="absolute inset-0 bg-slate-200 rounded-[2rem] transform rotate-2 translate-y-2"></div>
             <div className="relative bg-[#fffbeb] border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-xl transform transition-transform group-hover:-translate-y-1 group-hover:rotate-1 duration-500 overflow-hidden">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-8 border-b-2 border-dashed border-slate-200 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                         <Sun size={20} />
                      </div>
                      <div className="font-handwriting text-xl md:text-2xl font-body text-slate-700">My Holiday Plan</div>
                   </div>
                   <div className="text-slate-300 opacity-50">
                      <Clover className="w-8 h-8 md:w-10 md:h-10" />
                   </div>
                </div>

                {/* The Metaphor List */}
                <div className="space-y-4">
                   {/* Obligation: Crossed Out */}
                   <div className="flex items-center gap-3 md:gap-4 opacity-50">
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-red-300 rounded flex items-center justify-center shrink-0">
                         <X size={14} className="text-red-400" />
                      </div>
                      <span className="font-bold text-slate-400 text-base md:text-lg line-through decoration-red-400 decoration-2">毎日ログイン</span>
                   </div>
                   
                   {/* Obligation: Crossed Out */}
                   <div className="flex items-center gap-3 md:gap-4 opacity-50">
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-red-300 rounded flex items-center justify-center shrink-0">
                         <X size={14} className="text-red-400" />
                      </div>
                      <span className="font-bold text-slate-400 text-base md:text-lg line-through decoration-red-400 decoration-2">ノルマ達成</span>
                   </div>

                   {/* Freedom: Handwritten & Checked */}
                   <div className="flex items-center gap-3 md:gap-4 transform translate-x-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-[#5fbb4e] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                         <Check size={16} className="text-white" strokeWidth={4} />
                      </div>
                      <span className="font-handwriting-jp text-2xl md:text-3xl text-slate-700 rotate-[-1deg]">
                        気が向いたら遊ぶ
                      </span>
                   </div>

                   {/* Freedom: Handwritten & Checked */}
                   <div className="flex items-center gap-3 md:gap-4 transform translate-x-2 delay-100">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-[#5fbb4e] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                         <Check size={16} className="text-white" strokeWidth={4} />
                      </div>
                      <span className="font-handwriting-jp text-2xl md:text-3xl text-slate-700 rotate-[1deg]">
                        疲れたら休む
                      </span>
                   </div>
                </div>

                {/* Stamp */}
                <div className="absolute bottom-6 right-6 transform -rotate-12 opacity-80 mix-blend-multiply">
                   <div className="border-4 border-red-500 text-red-500 text-lg md:text-xl font-black px-2 py-1 md:px-4 md:py-2 rounded-lg tracking-widest uppercase mask-grunge">
                      APPROVED
                   </div>
                </div>
             </div>
          </div>
          
          <div>
            <h3 className="font-display font-black text-3xl md:text-4xl text-[#1e293b] mt-3">
              日常の合間に、<br/>
              気軽な冒険を。
            </h3>
            <p className="text-[#64748b] font-body text-base md:text-lg leading-relaxed mt-4 md:mt-6">
              出席確認もログインボーナスも、建築ノルマもありません。<br/>
              週末だけ、深夜だけ、あなたの都合で参加できます。<br/><br/>
              1週間空いても、1ヶ月空いても大丈夫。<br/>
              戻ってきたときに、自然に溶け込める場所です。
            </p>
          </div>
          <div className="md:hidden order-3 col-span-full h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent mt-10" />
        </div>

        {/* --- METAPHOR 2: The "Clan Banners" (Belonging) --- */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="order-2 md:order-1">
            <h3 className="font-display font-black text-3xl md:text-4xl text-[#1e293b] mt-3">
              クランで、<br/>
              <span className="text-indigo-600">仲間と繋がる。</span>
            </h3>
            <p className="text-[#64748b] font-body text-base md:text-lg leading-relaxed mt-4 md:mt-6">
              「クラン」は、共通の興味を持つ人たちのグループです。<br/>
              既存のクランに参加するのも、新しく立ち上げるのも自由。<br/><br/>
              建築ギルド、冒険パーティー、雑談コミュニティ。<br/>
              <strong>同じ「好き」を持つ人たちが、自然に集まっています。</strong>
            </p>
          </div>
          
          <div className="relative order-1 md:order-2 h-[320px] md:h-[400px] flex flex-col justify-start items-center pt-8 md:pt-10 perspective-1000">
             {/* The "Rope" holding banners */}
             <div className="absolute top-10 md:top-12 left-4 md:left-0 right-4 md:right-0 h-1 bg-slate-300 rounded-full transform -rotate-2 z-0"></div>
             
             <div className="relative z-10 w-full flex justify-center gap-4 md:gap-10 transform -rotate-2 px-2">
                
                {/* Banner 1: Construction */}
                <div className="group w-20 md:w-32 h-52 md:h-64 bg-blue-500 relative shadow-xl rounded-b-[3rem] md:rounded-b-[4rem] flex flex-col items-center pt-8 md:pt-10 transition-all duration-500 hover:h-[14.5rem] md:hover:h-[17rem] hover:bg-blue-600 origin-top animate-sway">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
                   <div className="w-3 h-3 bg-slate-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                   <div className="bg-white/20 p-2 md:p-3 rounded-full text-white mb-2 md:mb-4 backdrop-blur-sm">
                      <Castle size={22} className="md:w-7 md:h-7" />
                   </div>
                   <div className="text-white/90 font-bold text-center text-sm md:text-lg px-2 writing-vertical-rl h-[5.5rem] md:h-[6.5rem] tracking-widest opacity-80 group-hover:opacity-100">
                      建築ギルド
                   </div>
                </div>

                {/* Banner 2: Adventure */}
                <div className="group w-20 md:w-32 h-60 md:h-72 bg-orange-500 relative shadow-xl rounded-b-[3rem] md:rounded-b-[4rem] flex flex-col items-center pt-8 md:pt-10 transition-all duration-500 hover:h-[15.5rem] md:hover:h-[19rem] hover:bg-orange-600 origin-top animate-sway mt-4">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
                   <div className="w-3 h-3 bg-slate-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                   <div className="bg-white/20 p-2 md:p-3 rounded-full text-white mb-2 md:mb-4 backdrop-blur-sm">
                      <Map size={22} className="md:w-7 md:h-7" />
                   </div>
                   <div className="text-white/90 font-bold text-center text-sm md:text-lg px-2 writing-vertical-rl h-[5.5rem] md:h-[6.5rem] tracking-widest opacity-80 group-hover:opacity-100">
                      冒険者
                   </div>
                   <div className="absolute -bottom-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                      Popular
                   </div>
                </div>

                {/* Banner 3: Community */}
                <div className="group w-20 md:w-32 h-52 md:h-64 bg-[#5fbb4e] relative shadow-xl rounded-b-[3rem] md:rounded-b-[4rem] flex flex-col items-center pt-8 md:pt-10 transition-all duration-500 hover:h-[14.5rem] md:hover:h-[17rem] hover:bg-[#4ea540] origin-top animate-sway-delayed">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
                   <div className="w-3 h-3 bg-slate-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                   <div className="bg-white/20 p-2 md:p-3 rounded-full text-white mb-2 md:mb-4 backdrop-blur-sm">
                      <Pickaxe size={22} className="md:w-7 md:h-7" />
                   </div>
                   <div className="text-white/90 font-bold text-center text-sm md:text-lg px-2 writing-vertical-rl h-[5.5rem] md:h-[6.5rem] tracking-widest opacity-80 group-hover:opacity-100">
                      整地部
                   </div>
                </div>
             </div>
             
             {/* Decorative particles */}
             <div className="absolute bottom-10 right-10 md:right-20 text-indigo-200 transform rotate-12">
                <Crown size={48} className="md:w-16 md:h-16" opacity={0.2} />
             </div>
          </div>
          <div className="md:hidden order-3 col-span-full h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent mt-10" />
        </div>

        {/* --- METAPHOR 3: "Support" --- */}
        <div className="grid grid-cols-1">
          <Card className="bg-gradient-to-br from-white to-blue-50 !border-0 p-6 md:p-10 relative overflow-hidden group hover:translate-y-0">
             <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-blue-200 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
             <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                  <Phone size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-display font-black text-xl md:text-2xl text-[#1e293b] mt-3 mb-2 md:mb-4">
                    安心のサポート体制
                  </h3>
                  <p className="font-body text-[#64748b] leading-relaxed mb-6">
                    2019年からの運営実績があります。困りごとやトラブルには、経験豊富なスタッフが対応。初心者の方でも、安心して参加できる環境です。
                  </p>
                </div>
             </div>
          </Card>
        </div>

      </div>

      {/* Styles (Custom animations) */}
      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes sway-delayed {
          0%, 100% { transform: rotate(1deg); }
          50% { transform: rotate(-3deg); }
        }
        .animate-sway {
          animation: sway 6s ease-in-out infinite;
        }
        .animate-sway-delayed {
          animation: sway-delayed 7s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .mask-grunge {
          border-style: dashed;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1) translateX(-50%); }
          50% { opacity: 1; transform: scale(1.1) translateX(-50%); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }

      `}</style>
    </section>
  );
};

const StoryCard = ({ author, text, avatarColor }) => (
  <Card className="p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden h-full">
    <div className="absolute top-0 right-0 p-8 opacity-5">
      <MessageCircle size={80} />
    </div>
    
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${avatarColor} border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0`}>
        <span className="font-bold text-white text-lg md:text-xl">{author.charAt(0)}</span>
      </div>
      <div>
        <div className="font-bold text-[#1e293b] text-base md:text-lg">{author}</div>
      </div>
    </div>
    
    <div className="relative">
      <p className="font-body text-[#64748b] leading-relaxed italic text-sm md:text-base">
        "{text}"
      </p>
    </div>
  </Card>
);

const Stories = () => {
  return (
    <section id="reviews" className="py-20 md:py-24 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-8 md:mb-16">
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#5fbb4e] uppercase mt-3 mb-2">Player Stories</h3>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[#1e293b] mt-3">
              参加者の声
            </h2>
            <p className="text-[#64748b] font-body text-base md:text-lg leading-relaxed mt-4 md:mt-6">
              実際に参加している方々の感想です。<br/>
              クランでの活動や日常の交流を通じて、<br/>
              多くの繋がりが生まれています。
            </p>
          </div>
          {/* Mobile: Vertical Stack, Desktop: Staggered Grid */}
          <div className="flex flex-col gap-6">
             <StoryCard 
               author="n3kotarou" 
               avatarColor="bg-blue-400"
               text="入って3ヶ月経ちますが、スタッフ様の対応が良く、サーバー内の雰囲気も凄く良いサーバーです。マイクラ内では様々なイベントを楽しませて貰っております。新規さんでも楽しめるサーバーです。是非参加する事をおすすめします。"
             />
             <div className="md:translate-x-8">
               <StoryCard 
                 author="黄金ネズミ" 
                 avatarColor="bg-orange-400"
                 text="初心者、古参問わずにワイワイガヤガヤ楽しめるところが最大のウリと言っても良い。時折、繰り広げるイベントも趣向凝らされていて楽しめる。素晴らしいと思います。"
               />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = ({ discordInviteProps, discordInviteDisabledClass }) => {
  return (
    <section id="join" className="py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="bg-[#1e293b] rounded-[2rem] md:rounded-[3rem] p-8 py-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#5fbb4e] rounded-full mix-blend-overlay filter blur-3xl animate-blob" style={{ animationDelay: '2s'}}></div>
              <img
                src={joinImages.ctaOverlay.src}
                srcSet={joinImages.ctaOverlay.srcSet}
                sizes={IMAGE_SIZES.ctaOverlay}
                width={joinImages.ctaOverlay.width}
                height={joinImages.ctaOverlay.height}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                alt=""
                aria-hidden="true"
              />
           </div>

           <div className="relative z-10">
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#5fbb4e] uppercase mt-3 mb-2">Join Us</h3>
              <h2 className="font-display font-black text-3xl md:text-6xl text-white tracking-tight mt-3">
                ここで、始めよう。
              </h2>
              <p className="font-body text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mt-4 md:mt-6">
                900名以上が参加するコミュニティ。<br/>
                参加に必要なのは、Discordアカウントだけです。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-8 px-4 md:px-0">
                <Button
                  variant="discord"
                  className={`px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all ${discordInviteDisabledClass}`}
                  {...discordInviteProps}
                >
                   <img src={discordIcon} alt="" aria-hidden="true" className="w-6 h-6 mr-2" />
                   Discordに参加する
                </Button>
              </div>
              
           </div>
        </div>

        <div className="absolute -top-10 -right-4 sm:-top-12 sm:-right-6 md:-top-12 md:-right-8 transform rotate-6 animate-float z-20">
           <PhotoFrame
             caption="コケッ！"
             image={joinImages.ctaRight}
             sizes={IMAGE_SIZES.ctaRight}
             className="w-[6.3rem] sm:w-40 md:w-48"
           />
        </div>
        <div className="hidden md:block absolute -bottom-8 -left-8 transform -rotate-3 animate-float-delayed z-20">
           <PhotoFrame
             caption="よるのお花見"
             image={joinImages.ctaLeft}
             sizes={IMAGE_SIZES.ctaLeft}
             className="w-40"
           />
        </div>
      </div>
    </section>
  );
};

// --- Main App Component ---

export default function JoinLanding() {
  const defaults = getSiteDefaults();
  const canonical = normalizeUrl(defaults.baseUrl, "/");
  const ogImage =
    defaults.ogImage ||
    normalizeUrl(defaults.baseUrl, joinImages.heroMain?.src);
  const joinTitle = "Discordメンバー募集";
  const joinDescription =
    "建築・冒険・雑談まで自由に遊べるDiscordコミュニティ。900名が集まるサーバーの参加方法や雰囲気を紹介します。";
  const organization = {
    "@type": "Organization",
    "@id": canonical ? `${canonical}#organization` : undefined,
    name: defaults.siteName,
    url: canonical || defaults.baseUrl,
  };
  if (defaults.logo) {
    organization.logo = defaults.logo;
  }
  if (defaults.socials.length > 0) {
    organization.sameAs = defaults.socials;
  }

  const schema =
    defaults.baseUrl && canonical
      ? {
          "@context": "https://schema.org",
          "@graph": [
            organization,
            {
              "@type": "WebSite",
              "@id": `${canonical}#website`,
              url: canonical,
              name: defaults.siteName,
              publisher: { "@id": `${canonical}#organization` },
            },
            {
              "@type": "WebPage",
              "@id": `${canonical}#webpage`,
              url: canonical,
              name: joinTitle,
              description: joinDescription,
              isPartOf: { "@id": `${canonical}#website` },
              about: { "@id": `${canonical}#organization` },
            },
          ],
        }
      : null;
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    ensureJoinLandingFonts();
  }, []);

  const discordInviteProps = HAS_DISCORD_INVITE_URL
    ? { href: DISCORD_INVITE_URL, target: "_blank", rel: "noopener noreferrer" }
    : {
        onClick: handleMissingDiscordInvite,
        "aria-disabled": true,
        title: "Discord招待URLの設定が未完了です",
      };

  const discordInviteDisabledClass = HAS_DISCORD_INVITE_URL
    ? ""
    : "opacity-70 cursor-not-allowed";

  const navItems = [
    { href: "#memories", label: "ギャラリー" },
    { href: "#reviews", label: "メンバーの声" },
    { href: "#features", label: "特徴" },
    { href: "#join", label: "参加方法" },
  ];

  const headerAction = (
    <Button
      variant="discord"
      className={`px-5 py-2 text-sm ${discordInviteDisabledClass}`}
      {...discordInviteProps}
    >
      <img src={discordIcon} alt="" aria-hidden="true" className="w-4 h-4 mr-2" />
      Discordに参加
    </Button>
  );

  const mobileHeaderAction = (
    <Button
      variant="discord"
      className={`w-full py-3 ${discordInviteDisabledClass}`}
      {...discordInviteProps}
    >
      Discordに参加
    </Button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-[#5fbb4e] selection:text-white">
      <Seo
        title={joinTitle}
        description={joinDescription}
        path="/"
        image={ogImage}
        type="website"
        schema={schema}
        schemaId="join-landing"
      />
      {/* Styles for Custom Animations & Fonts */}
      <style>{`
        :root {
          --font-display: 'Outfit', sans-serif;
          --font-body: 'M PLUS Rounded 1c', sans-serif;
          --font-handwriting: 'Caveat', cursive;
          --font-handwriting-jp: 'Zen Kurenaido', 'M PLUS Rounded 1c', sans-serif;
          --font-polaroid-caption: 'Zen Kurenaido', 'M PLUS Rounded 1c', sans-serif;
        }

        .font-display { font-family: var(--font-display); }
        .font-body { font-family: var(--font-body); }
        .font-handwriting { font-family: var(--font-handwriting); }
        .font-handwriting-jp { font-family: var(--font-handwriting-jp); }
        .font-polaroid-caption { font-family: var(--font-polaroid-caption); }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-15px) rotate(-6deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>

      <Header
        navItems={navItems}
        navPosition="right"
        rightSlot={headerAction}
        mobileNavAction={mobileHeaderAction}
        onScrollTop={scrollToTop}
      />
      <main>
        <Hero />
        <div className="bg-white py-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
        </div>
        <MemoryLane />
        <Stories />
        <RefinedFeatures />
        <CTA
          discordInviteProps={discordInviteProps}
          discordInviteDisabledClass={discordInviteDisabledClass}
        />
      </main>
      <Footer onScrollTop={scrollToTop} />
    </div>
  );
}

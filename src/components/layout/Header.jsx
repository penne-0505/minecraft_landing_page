import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import InteractiveClover from "../ui/InteractiveClover";
import { beginDiscordLogin } from "../../utils/discordAuth";
import discordIcon from "../../assets/icons/Discord-Symbol-White.svg";

const Header = ({
  isLoggedIn,
  user,
  onLogin,
  onLogout,
  onScrollTop,
  navItems = [],
  navPosition = "center",
  rightSlot,
  mobileNavAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasNav = navItems.length > 0;
  const isMembershipPage =
    typeof window !== "undefined" &&
    /^\/membership(\/|$)/.test(window.location.pathname);
  const loginIconSrc = isMembershipPage
    ? discordIcon
    : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ac.svg";
  const loginIconClassName = `w-5 h-5 shrink-0 ${
    isMembershipPage ? "" : "invert brightness-0"
  }`;

  const displayUser = user ?? {
    name: "Guest",
    discriminator: "0000",
    avatar:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg",
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }
    beginDiscordLogin();
  };

  const handleBrandClick = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        onScrollTop?.();
        return;
      }
      window.location.href = "/";
      return;
    }
    onScrollTop?.();
  };

  return (
    <nav className="fixed top-0 w-full z-50 h-16 md:h-20 flex items-center glass-header shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center relative">
        <motion.button
          onClick={handleBrandClick}
          className="flex items-baseline gap-2 group cursor-pointer text-left focus:outline-none"
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg md:text-xl font-extrabold tracking-tight brand-font text-slate-700 transition-colors duration-300 group-hover:text-[#5fbb4e]">
            Minecraft Server <InteractiveClover />
          </span>
          {isMembershipPage && (
            <span className="text-[#5fbb4e] font-black text-xs uppercase tracking-wide hidden sm:inline-block bg-[#5fbb4e]/10 px-2 py-0.5 rounded-full border border-[#5fbb4e]/20 group-hover:bg-[#5fbb4e]/20 transition-colors">
              Supporters
            </span>
          )}
        </motion.button>

        {hasNav && navPosition === "center" && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-[#5fbb4e] transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-5">
          {hasNav && navPosition === "right" && (
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-[#5fbb4e] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          {hasNav && (
            <button
              className="md:hidden p-2 text-slate-500"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          {rightSlot ? (
            <div className={hasNav ? "hidden md:block" : ""}>{rightSlot}</div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col items-end">
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.05, backgroundColor: "#4752C4" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#5865F2] text-white font-bold text-sm btn-push flex items-center justify-center gap-2 shadow-[0_4px_0_#4752C4] transition-all duration-300 px-5 py-2.5 rounded-xl"
              >
                <img
                  src={loginIconSrc}
                  className={loginIconClassName}
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
                  displayUser.avatar ||
                  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
                }
                alt="User"
                className="w-8 h-8 rounded-full bg-white shadow-sm"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-slate-700">
                  {displayUser.name ?? "Unknown"}
                </span>
                <span className="text-[10px] text-slate-400">
                  Login as #{displayUser.discriminator ?? "0000"}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {hasNav && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg"
              style={{ overflow: "hidden" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3 items-center text-center">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-slate-600 font-bold hover:text-[#5fbb4e] transition-colors w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {(mobileNavAction || rightSlot) && (
                  <div className="pt-2 w-full flex justify-center">
                    {mobileNavAction ?? rightSlot}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </nav>
  );
};

export default Header;

import React from "react";
import InteractiveClover from "../ui/InteractiveClover";
import FooterLink from "../ui/FooterLink";

const Footer = ({ onScrollTop }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-12">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 opacity-80">
            <a
              href="/"
              className="font-bold text-slate-700 brand-font text-lg cursor-pointer select-none"
            >
              Minecraft Server <InteractiveClover />
            </a>
        </div>
      <div className="flex justify-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-slate-400 flex-wrap">
        <FooterLink href="/legal/terms">利用規約</FooterLink>
        <FooterLink href="/legal/tokusho">特定商取引法に基づく表記</FooterLink>
        <FooterLink href="/legal/privacy">プライバシーポリシー</FooterLink>
        <FooterLink href="/legal/refund">返金ポリシー</FooterLink>
        <FooterLink href="/membership">メンバーシップページ</FooterLink>
      </div>
      <div className="text-xs text-slate-300 font-bold">
        &copy; 2025 Minecraft Server 🍀 Not affiliated with Mojang or Microsoft.
      </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import { Check, Shield, Users } from "lucide-react";
import Placeholder from "./Placeholder.jsx";

const Contract = () => {
  const [consentDisplay, setConsentDisplay] = useState(true);
  const [consentRoles, setConsentRoles] = useState(true);

  // ここではStripe遷移をまだ行わず、同意取得UIのみ提供。
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
      `}</style>
      <main className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 text-center">
          支援手続きの確認
        </h1>
        <p className="text-center text-sm text-slate-600 mb-10">
          支援者表示への同意と、Discord ロール付与の可否を選択したうえで、Stripe 決済へ進みます。
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-5">
          <ToggleRow
            title="支援者として名前を表示する"
            desc="支援者一覧やサーバー内でのクレジット表記に Discord 名を利用します。"
            checked={consentDisplay}
            onChange={() => setConsentDisplay(!consentDisplay)}
          />
          <ToggleRow
            title="支援ロールを自動付与する"
            desc="決済完了後、自動的にサポーターロールを付与し、特典チャンネルへアクセス可能にします。"
            checked={consentRoles}
            onChange={() => setConsentRoles(!consentRoles)}
          />

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <div className="font-bold text-slate-800 mb-2">次のステップ</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Discord ログインを完了する</li>
              <li>上記の同意内容を確認する</li>
              <li>Stripe へ遷移してプランを選択・決済する</li>
            </ol>
          </div>

          <button
            disabled={!consentRoles}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
              consentRoles
                ? "bg-[#5fbb4e] text-white hover:bg-[#4a9a3d]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Shield size={20} />
            Stripe へ進む（後日接続予定）
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 mt-4">
          ※ 現時点では決済フロー未接続です。後続実装で Stripe Checkout を統合します。
        </div>
      </main>
    </div>
  );
};

const ToggleRow = ({ title, desc, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <div
      className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition-colors ${
        checked ? "bg-[#5fbb4e] border-[#4a9a3d]" : "bg-white border-slate-300"
      }`}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
    >
      {checked && <Check size={16} className="text-white" />}
    </div>
    <div className="flex-1">
      <div className="font-bold text-slate-800">{title}</div>
      <div className="text-sm text-slate-600 leading-relaxed">{desc}</div>
    </div>
  </label>
);

export default Contract;

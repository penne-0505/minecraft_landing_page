import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Leaf } from "lucide-react";

const tabs = [
  {
    key: "terms",
    label: "利用規約",
    file: "/_docs/guide/legal/terms-of-service.md",
    summary:
      "サービス利用時の禁止事項・責任範囲・アカウント停止条件・準拠法などをここに記載します。",
  },
  {
    key: "privacy",
    label: "プライバシーポリシー",
    file: "/_docs/guide/legal/privacy-policy.md",
    summary:
      "収集する情報、利用目的、保存期間、第三者提供、問い合わせ窓口をここに記載します。",
  },
  {
    key: "tokusho",
    label: "特商法表記",
    file: "/_docs/guide/legal/specified-commercial-transaction.md",
    summary:
      "事業者名、所在地、連絡先、販売価格、支払方法、返品・キャンセル条件などをここに記載します。",
  },
  {
    key: "refund",
    label: "返金ポリシー",
    file: "/_docs/guide/legal/refund-policy.md",
    summary:
      "返金可否、返金条件、手続き手順、返金不可のケースをここに記載します。",
  },
];

const TermsTabs = ({ initialKey }) => {
  const [active, setActive] = useState(initialKey || tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors duration-200 ${
              active === tab.key
                ? "bg-[#5fbb4e]/10 text-[#1e293b] border-[#5fbb4e]/30"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={18} className="text-[#5fbb4e]" />
          <span className="font-bold text-slate-800 text-sm">{current.label}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">{current.summary}</p>
        <p className="text-xs text-slate-500 mb-4">
          詳細は後日正式文面を挿入します。更新時期はお知らせにて通知します。
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={current.file}
            className="px-3 py-2 rounded-lg bg-[#5fbb4e] text-white text-sm font-semibold shadow-sm hover:bg-[#4a9a3d] transition-colors"
          >
            プレースホルダを表示
          </a>
          <span className="text-[11px] text-slate-500">
            ファイルパス: {current.file.replace("/_docs/", "_docs/")}
          </span>
        </div>
      </div>
    </div>
  );
};

const LegalPage = () => {
  const { section } = useParams();
  const initialKey = tabs.some((t) => t.key === section) ? section : tabs[0].key;

  useEffect(() => {
    if (section && tabs.some((t) => t.key === section)) {
      // scroll to top on tab route change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [section]);

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
      `}</style>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 text-center">
          規約・ポリシー
        </h1>
        <p className="text-center text-sm text-slate-500 mb-8">
          利用規約 / プライバシーポリシー / 特定商取引法に基づく表記 / 返金ポリシーを切り替えて参照できます。
          文面は後日確定し次第、ここに反映されます。
        </p>
        <TermsTabs initialKey={initialKey} />
      </main>
    </div>
  );
};

export default LegalPage;

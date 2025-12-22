import React from "react";
import { Leaf } from "lucide-react";

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans flex items-center justify-center px-4">
      <style>{`
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
      `}</style>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 max-w-xl w-full text-center">
        <div className="flex justify-center mb-4 text-[#5fbb4e]">
          <Leaf size={32} />
        </div>
        <h1 className="text-2xl font-black mb-2">{title}</h1>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        <div className="mt-6 text-xs text-slate-400">Coming soon</div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

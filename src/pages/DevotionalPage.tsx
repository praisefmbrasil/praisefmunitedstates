import React from 'react';
import { Book } from 'lucide-react';
import DailyVerse from '../components/DailyVerse';

const DevotionalPage: React.FC = () => {
  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen pb-20 text-white">
      {/* Header */}
      <div className="relative overflow-hidden py-20 md:py-28 text-center border-b border-white/10">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
            alt=""
          />
          {/* Esmaece a foto para o fundo ambiente, sem corte seco */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>
        <div className="relative z-10 px-4">
          <Book className="w-16 h-16 text-[#ff6600] mx-auto mb-8" />
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            Devotional
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto uppercase tracking-tight">
            Faith, Reflected. Your Daily Digital Bread.
          </p>
        </div>
      </div>

      <DailyVerse />
    </div>
  );
};

export default DevotionalPage;
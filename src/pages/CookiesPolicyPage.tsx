import React from 'react';
import { ArrowLeft, Cookie, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiesPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      <div className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/60 hover:text-white mb-8 text-[10px] font-medium uppercase tracking-[0.4em] group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <Cookie className="w-8 h-8 text-[#ff6600]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#ff6600]">
              Data Storage
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Cookies<br />Policy
          </h1>
          <p className="text-white/60 uppercase tracking-widest text-xs">
            Last Updated: January 20, 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 text-white/80 leading-relaxed uppercase tracking-tight">
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-6 text-white border-b-2 border-[#ff6600] pb-3 inline-block">
              What are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device that help us provide a seamless
              experience. At Praise FM USA, we use them to remember your session and player
              preferences.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Shield className="w-6 h-6 text-[#ff6600] mb-5" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4 text-white">
                Essential Cookies
              </h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Settings className="w-6 h-6 text-[#ff6600] mb-5" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4 text-white">
                Player Preferences
              </h3>
              <p className="text-sm text-white/60 uppercase tracking-tight leading-relaxed">
                We store your volume level and recently played tracks locally on your browser.
              </p>
            </div>
          </div>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-6 text-white border-b-2 border-[#ff6600] pb-3 inline-block">
              Managing Cookies
            </h2>
            <p>
              You can control or delete cookies through your browser settings. However, please note
              that disabling essential cookies will prevent you from signing in or saving your "My
              Sounds" library.
            </p>
          </section>

          <div className="p-6 md:p-8 bg-[#ff6600]/10 border border-[#ff6600]/60 rounded-2xl text-center">
            <p className="text-white text-sm uppercase tracking-widest">
              We do not use third-party advertising cookies to track your behavior across other
              websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
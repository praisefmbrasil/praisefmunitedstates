
import React from 'react';
import { Scale, ShieldCheck, FileText, ArrowLeft, ChevronRight, Globe, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'broadcasting', title: '2. Broadcasting Rights' },
  { id: 'conduct', title: '3. User Conduct' },
  { id: 'accounts', title: '4. Account Security' },
  { id: 'ip', title: '5. Intellectual Property' },
  { id: 'liability', title: '6. Limitation of Liability' },
  { id: 'changes', title: '7. Changes to Terms' }
];

const TermsOfUsePage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      <div className="bg-black text-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-8 text-[10px] font-medium uppercase tracking-[0.4em] group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <Scale className="w-8 h-8 text-[#ff6600]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#ff6600]">User Agreement</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-6">Terms of<br />Use</h1>
          <p className="text-gray-400 uppercase tracking-widest text-xs">Effective Date: January 20, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Navigation</h3>
            <nav className="space-y-4">
              {SECTIONS.map((section) => (
                <button key={section.id} onClick={() => scrollToSection(section.id)} className="flex items-center group w-full text-left">
                  <ChevronRight className="w-3 h-3 mr-2 text-[#ff6600] opacity-0 group-hover:opacity-100 transition-all" />
                  <span className="text-[11px] font-medium uppercase tracking-tight text-gray-500 group-hover:text-black dark:group-hover:text-white">
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-9 space-y-20">
            <section id="acceptance" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">1. Acceptance of Terms</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-normal leading-relaxed uppercase tracking-tight">
                <p>By accessing or using Praise FM USA services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our platforms.</p>
              </div>
            </section>

            <section id="broadcasting" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">2. Broadcasting Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm leading-relaxed mb-6">Praise FM USA provides a 24/7 digital broadcast. You are granted a personal, non-commercial, limited license to listen to our stream for private entertainment purposes only.</p>
              <div className="bg-gray-50 dark:bg-white/5 p-8 border-l-4 border-[#ff6600]">
                <p className="text-xs font-regular text-black dark:text-white uppercase tracking-widest">PROHIBITED: Redistribution, recording for commercial use, or re-broadcasting of our signal without written consent is strictly forbidden.</p>
              </div>
            </section>

            <section id="conduct" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">3. User Conduct</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <Globe className="w-6 h-6 text-[#ff6600] mb-6" />
                  <h4 className="text-lg font-medium uppercase tracking-tight mb-4 dark:text-white">Global Respect</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-tight leading-relaxed">Users must interact with our community features (shoutouts, feedback) in a respectful, faith-affirming manner.</p>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <AlertTriangle className="w-6 h-6 text-[#ff6600] mb-6" />
                  <h4 className="text-lg font-medium uppercase tracking-tight mb-4 dark:text-white">System Integrity</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-tight leading-relaxed">Attempting to bypass security measures or scrape our streaming data is a violation of these terms.</p>
                </div>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">4. Account Security</h2>
            </section>

            <section id="ip" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">5. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm leading-relaxed">All content on Praise FM USA, including logos, graphics, and specific curated playlists, is the property of Praise FM Global or its licensors and is protected by copyright laws.</p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;

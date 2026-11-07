
import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'data-collection', title: '2. Data We Collect' },
  { id: 'usage', title: '3. How We Use Your Data' },
  { id: 'cookies', title: '4. Cookies & Tracking' },
  { id: 'storage', title: '5. Storage & Security' },
  { id: 'rights', title: '6. Your Rights' },
  { id: 'contact', title: '7. Contact Us' }
];

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      {/* Header Estilo Editorial */}
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
            <Shield className="w-8 h-8 text-[#ff6600]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#ff6600]">Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-6">Privacy<br />Policy</h1>
          <p className="text-gray-400 uppercase tracking-widest text-xs">Last updated: January 20, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Contents</h3>
            <nav className="space-y-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center group w-full text-left"
                >
                  <ChevronRight className="w-3 h-3 mr-2 text-[#ff6600] opacity-0 group-hover:opacity-100 transition-all" />
                  <span className="text-[11px] font-medium uppercase tracking-tight text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-9 space-y-20">
            
            <section id="introduction" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">1. Introduction</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-normal leading-relaxed uppercase tracking-tight">
                <p>At Praise FM USA, we are committed to protecting your personal information and being transparent about what we do with it. This policy sets out how we use your personal data when you use our website, mobile applications, or interact with our digital broadcasting services.</p>
                <p className="mt-4">We act as a data controller for the information we collect and are dedicated to processing it in accordance with global privacy standards.</p>
              </div>
            </section>

            <section id="data-collection" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">2. Data We Collect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <Lock className="w-6 h-6 text-[#ff6600] mb-6" />
                  <h4 className="text-lg font-medium uppercase tracking-tight mb-4 dark:text-white">Account Information</h4>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <Eye className="w-6 h-6 text-[#ff6600] mb-6" />
                  <h4 className="text-lg font-medium uppercase tracking-tight mb-4 dark:text-white">Usage Data</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-tight leading-relaxed">We collect information about your interactions with our player, including "hearted" tracks, favorited devotionals, and search history to personalize your experience.</p>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">3. How We Use Your Data</h2>
              <ul className="space-y-6 text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-[#ff6600] text-black text-[10px] font-black flex items-center justify-center mr-4 flex-shrink-0">A</span>
                  <span>To provide and maintain our live streaming and podcast services.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-[#ff6600] text-black text-[10px] font-black flex items-center justify-center mr-4 flex-shrink-0">B</span>
                  <span>To notify you about changes to our schedule or upcoming events (if you opted in for alerts).</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-[#ff6600] text-black text-[10px] font-black flex items-center justify-center mr-4 flex-shrink-0">C</span>
                  <span>To improve our platform performance and user interface based on aggregated usage patterns.</span>
                </li>
              </ul>
            </section>

            <section id="cookies" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">4. Cookies & Tracking</h2>
              <div className="bg-gray-50 dark:bg-white/5 p-10">
                <p className="text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm leading-relaxed mb-6">We use essential cookies to maintain your login session and store your player preferences (like volume and theme). These are necessary for the website to function correctly.</p>
                <div className="flex items-center space-x-3 text-[#ff6600]">
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">View Cookie Policy</span>
                </div>
              </div>
            </section>

            <section id="storage" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">5. Storage & Security</h2>
            </section>

            <section id="rights" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">6. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm leading-relaxed mb-6">You have the right to access, update, or delete the information we have on you. You can perform these actions directly from your profile page or by contacting our support team.</p>
              <button 
                onClick={() => navigate('/profile')}
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all"
              >
                Access Profile Settings
              </button>
            </section>

            <section id="contact" className="scroll-mt-32">
              <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">7. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400 font-normal uppercase tracking-tight text-sm leading-relaxed">For any questions regarding this Privacy Policy, please contact our Data Protection Officer at:</p>
              <div className="mt-8">
                <p className="text-black dark:text-white text-xl font-medium uppercase tracking-tighter">privacy@praisefmusa.com</p>
                <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest mt-2">Compliance Department — PRAISE FM USA</p>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="py-20 bg-gray-50 dark:bg-[#0a0a0a] text-center">
        <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-[0.5em]">Trust • Transparency • Faith</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

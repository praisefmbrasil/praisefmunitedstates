import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Headphones, Radio, User, Smartphone, Info, Mail, MessageSquare, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HELP_CATEGORIES = [
  {
    id: 'streaming',
    title: 'Streaming & Radio',
    icon: Radio,
    type: 'technical',
    topics: ['Trouble connecting to live stream', 'Audio quality issues', 'Chromecast & AirPlay support', 'Supported browsers']
  },
  {
    id: 'account',
    title: 'Your Account',
    icon: User,
    type: 'general',
    topics: ['Managing your favorites', 'Resetting your password', 'Changing email preferences', 'Privacy settings']
  },
  {
    id: 'mobile',
    title: 'Mobile Apps',
    icon: Smartphone,
    type: 'technical',
    topics: ['Installing on iOS/Android', 'Offline listening', 'Background playback', 'Push notifications']
  },
  {
    id: 'general',
    title: 'General Info',
    icon: Info,
    type: 'general',
    topics: ['Song requests', 'Artist submissions', 'Broadcasting schedule', 'Advertising with us']
  }
];

const POPULAR_ARTICLES = [
  { text: 'How to listen to Praise FM USA offline', type: 'technical' },
  { text: 'Fixing common buffering issues', type: 'technical' },
  { text: 'Managing your personal library', type: 'general' },
  { text: 'How to enter on-air competitions', type: 'general' },
  { text: 'Connecting to smart speakers (Alexa/Google)', type: 'technical' },
  { text: 'Updating your account security', type: 'general' }
];

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return HELP_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return HELP_CATEGORIES.filter(cat =>
      cat.title.toLowerCase().includes(query) ||
      cat.topics.some(topic => topic.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleTopicClick = (type: string, topic: string) => {
    navigate(`/feedback?type=${type}&subject=${encodeURIComponent(topic)}`);
  };

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      {/* Search Header */}
      <div className="py-14 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff6600]/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/60 hover:text-white mb-8 mx-auto text-[10px] font-medium uppercase tracking-[0.4em] group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">Help Centre</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="How can we help you today?"
              className="w-full bg-black/30 backdrop-blur-xl border border-white/10 pl-16 pr-6 py-5 rounded-2xl text-lg font-medium text-white focus:border-[#ff6600] focus:ring-0 outline-none transition-all placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 md:mb-28">
          {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white/5 backdrop-blur border border-white/10 hover:border-[#ff6600]/60 rounded-2xl p-7 transition-colors animate-in fade-in duration-500"
            >
              <cat.icon className="w-10 h-10 mb-6 text-[#ff6600]" />
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6 text-white">{cat.title}</h2>
              <ul className="space-y-4">
                {cat.topics.map((topic, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleTopicClick(cat.type, topic)}
                      className="text-white/60 hover:text-white text-[13px] font-normal uppercase tracking-tight flex items-center group/item text-left transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 mr-2 text-[#ff6600] opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/20 rounded-2xl bg-black/20">
              <p className="text-white/60 uppercase tracking-widest text-sm">No topics found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[#ff6600] uppercase text-[10px] tracking-widest hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Popular Articles */}
        <section className="mb-20 md:mb-28">
          <h3 className="text-2xl text-white mb-8 uppercase font-bold tracking-tight border-l-4 border-[#ff6600] pl-4">Popular Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POPULAR_ARTICLES.map((article, i) => (
              <button
                key={i}
                onClick={() => handleTopicClick(article.type, article.text)}
                className="bg-white/5 backdrop-blur border border-white/10 hover:border-[#ff6600]/60 hover:bg-white/10 rounded-2xl p-6 md:p-7 text-left transition-colors flex items-center justify-between gap-4 group"
              >
                <span className="text-lg font-bold text-white group-hover:text-[#ff6600] uppercase tracking-tighter transition-colors">{article.text}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 text-white/40 group-hover:text-[#ff6600] transition-colors" />
              </button>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <div className="bg-[#ff6600]/10 backdrop-blur-xl border border-[#ff6600]/60 rounded-2xl p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">Still need help?</h4>
            <p className="text-white/70 text-lg font-normal uppercase tracking-tight leading-snug">Our support team is available 24/7 to ensure your worship experience is uninterrupted.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@praisefmusa.com?subject=Help Request"
              className="bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl px-8 py-4 flex items-center justify-center space-x-3 transition-all text-[11px] font-black uppercase tracking-[0.2em] active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
            <button
              onClick={() => navigate('/feedback?type=technical')}
              className="bg-white/10 hover:bg-white hover:text-black border border-white/30 text-white rounded-xl px-8 py-4 flex items-center justify-center space-x-3 transition-all text-[11px] font-black uppercase tracking-[0.2em] active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="py-14 text-center border-t border-white/10">
        <div className="flex items-center justify-center space-x-2 text-white/50 mb-4">
          <Headphones className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">24/7 Global Support</span>
        </div>
        <p className="text-[10px] text-white/40 uppercase tracking-widest">Praise FM USA Help Centre — Excellence in every detail.</p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
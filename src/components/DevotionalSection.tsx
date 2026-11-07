import React, { useEffect, useState } from 'react';
import { Mic2, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VerseData {
  reference: string;
  text: string;
}

const DevotionalSection: React.FC = () => {
  const navigate = useNavigate();
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Exemplo de integração buscando um versículo do dia de uma API pública
  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        // Usando uma API pública de exemplo (Bible API / Labs) ou endpoint próprio
        const response = await fetch('https://bible-api.com/John+3:16?translation=almeida');
        const data = await response.json();
        
        if (data && data.text) {
          setVerse({
            reference: data.reference,
            text: data.text.trim(),
          });
        }
      } catch (error) {
        console.error('Erro ao carregar versículo:', error);
        // Fallback caso a API falhe
        setVerse({
          reference: 'João 3:16',
          text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  return (
    <section className="py-16 bg-[#f8f8f8] dark:bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center space-x-3 mb-6">
          <div className="p-2 bg-[#ff6600] rounded-lg">
            <Mic2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight dark:text-white">
            Daily Devotional
          </h2>
        </div>

        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
          Start your day with spiritual encouragement. Listen to short, powerful devotionals 
          that strengthen your faith and draw you closer to God.
        </p>

        {/* Card dinâmico com o Versículo da API */}
        <div className="bg-white dark:bg-[#171717] rounded-3xl p-6 md:p-8 shadow-xl border border-black/5 dark:border-white/5 mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <BookOpen className="w-32 h-32 text-orange-500" />
          </div>

          <div className="flex items-center gap-2 text-orange-500 text-xs font-black uppercase tracking-widest mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Verse of the Day</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : (
            <div>
              <blockquote className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 mb-4 italic">
                "{verse?.text}"
              </blockquote>
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                — {verse?.reference}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/devotional')}
          className="inline-flex items-center px-8 py-4 bg-[#ff6600] text-white font-black uppercase text-sm tracking-wider rounded-2xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 active:scale-95"
        >
          Listen Now <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </section>
  );
};

export default DevotionalSection;
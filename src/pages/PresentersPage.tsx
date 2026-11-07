import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Program } from '../types';
import { SCHEDULES } from '../constants';
import { cloudinaryImage } from '../cloudinaryImage';

interface PresentersPageProps {
  onNavigateToProgram: (program: Program) => void;
}

const PRESENTERS_DATA = [
  {
    name: 'Stancy Campbell',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782157748/stancy-campbell_zwsout.webp',
    bio: 'The energetic voice behind the Morning Show, bringing music and encouragement to weekday mornings.',
    programTitle: 'Morning Show'
  },
  {
    name: 'Michael Ray',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/michael-ray_n6ylzs.webp',
    bio: 'Michael Ray is your afternoon companion on Midday Grace, bringing worship, peace, and encouragement during the busiest part of the day.',
    programTitle: 'Midday Grace'
  },
  {
    name: 'DJ Kenny AJ',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791853506/praise-fm-flow_ef6gqq.webp',
    bio: 'DJ Kenny AJ brings fresh Christian hip-hop, rhythm, and energy to Praise FM Flow.',
    programTitle: 'Praise FM Flow'
  },
  {
    name: 'Sarah Jordan',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/sarah-jordan_tfnxpp.webp',
    bio: 'Sarah hosts Future Artists, where she discovers and promotes independent talent from around the world.',
    programTitle: 'Future Artists'
  },
  {
    name: 'Rachael Harris',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/rachael-harris_pwfg0z.webp',
    bio: 'Rachael brings the hits and the perfect drive-home vibe on Praise FM Carpool.',
    programTitle: 'Praise FM Carpool'
  },
  {
    name: 'Lexxa',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1791853506/praise-fm-rock_mz54t4.webp',
    bio: 'Lexxa turns up the volume with powerful Christian rock, bold sounds, and faith-driven energy on Praise FM Rock.',
    programTitle: 'Praise FM Rock'
  },
  {
    name: 'Scott Turner',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/scott-turner_cwy1bc.webp',
    bio: 'A historian of worship music, Scott hosts Praise FM Classics, taking listeners back to timeless songs that shaped generations.',
    programTitle: 'Classics'
  },
  {
    name: 'Ava Brooks',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158973/ava-brooks_oyzibl.webp',
    bio: 'Ava closes the day with Praise FM Chill, creating the perfect atmosphere.',
    programTitle: 'Praise FM Chill'
  },
  {
    name: 'Daniel Brooks',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/daniel-brooks_qbfdgc.webp',
    bio: 'The voice of the night. Daniel leads Midnight Grace with peaceful music and a calm overnight presence.',
    programTitle: 'Midnight Grace'
  },
  {
    name: 'Nick Cusack',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1792222383/weekend-morning_f0j3oi.webp',
    bio: 'Nick brings a fresh start to the weekend with uplifting music, positive energy, and great company on Weekend morning.',
    programTitle: 'Weekend Morning'
  },
  {
    name: 'Arthur Bradford',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1793619657/arthur_bradford_zzmftc.webp',
    bio: 'Arthur Bradford brings the timeless beauty of traditional hymns and beloved worship classics to Golden Hymns, celebrating the songs that have inspired generations.',
    programTitle: 'Golden Hymns'
  },
];

const PresentersPage: React.FC<PresentersPageProps> = ({ onNavigateToProgram }) => {
  const navigate = useNavigate();

  const findProgram = (title: string) => {
    for (let day = 0; day <= 6; day++) {
      const prog = (SCHEDULES[day] || []).find((p) => p.title === title);
      if (prog) return prog;
    }
    return null;
  };

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      <div className="py-16 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff6600]/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-6">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em]">
              The Voices of Praise FM USA
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
            Our
            <br />
            Presenters
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl font-normal tracking-tight leading-relaxed">
            Meet the voices behind the music, worship, inspiration, and special programming that shape the sound of Praise FM USA every day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRESENTERS_DATA.map((presenter) => {
            const program = findProgram(presenter.programTitle);

            return (
              <div
                key={presenter.name}
                className="flex flex-col group bg-white/5 backdrop-blur border border-white/10 hover:border-[#ff6600]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={cloudinaryImage(presenter.image, 568, 710)}
                    alt={presenter.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity"></div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[#ff6600] text-[10px] font-medium uppercase tracking-[0.3em] mb-2 block">
                      {presenter.programTitle}
                    </span>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">
                      {presenter.name}
                    </h2>
                  </div>
                </div>

                <div className="p-7 flex-grow flex flex-col">
                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    {presenter.bio}
                  </p>

                  <div className="mt-auto">
                    {program ? (
                      <button
                        onClick={() => onNavigateToProgram(program)}
                        className="w-full bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-colors active:scale-95"
                      >
                        <span>View Program</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full border border-white/10 rounded-xl py-4 px-6 text-[10px] text-center text-white/50 uppercase tracking-[0.2em]">
                        Program page coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 md:mt-24 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-16 flex flex-col items-center text-center">
          <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-6">
            Want the full lineup?
          </h4>

          <p className="text-white/60 max-w-xl text-sm mb-10 leading-relaxed">
            Explore the complete broadcasting schedule and discover every show that makes Praise FM USA your home for worship, encouragement, and great music.
          </p>

          <button
            onClick={() => navigate('/schedule')}
            className="bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            Full Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentersPage;
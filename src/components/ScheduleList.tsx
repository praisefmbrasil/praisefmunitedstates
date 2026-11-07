import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SCHEDULES } from '../constants';
import { Program } from '../types';
import { cloudinaryImage } from '../cloudinaryImage';

interface ScheduleListProps {
  onNavigateToProgram: (program: Program) => void;
  onBack?: () => void;
}

const getChicagoDate = (baseDate: Date = new Date()) => {
  return new Date(baseDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
};

const ProgramProgressRing: React.FC<{ program: Program; isActive: boolean; nowMinutes: number }> = React.memo(
  ({ program, isActive, nowMinutes }) => {
    const progress = useMemo(() => {
      if (!isActive) return 0;

      const [sH, sM] = program.startTime.split(':').map(Number);
      const [eH, eM] = program.endTime.split(':').map(Number);

      const start = sH * 60 + sM;
      let end = eH * 60 + eM;

      if (end === 0 || end <= start) end = 24 * 60;

      const elapsed = nowMinutes - start;
      const duration = end - start;

      return Math.min(Math.max(elapsed / duration, 0), 1);
    }, [program, isActive, nowMinutes]);

    const size = 120;
    const strokeWidth = 3;
    const innerSize = size - 24;
    const radius = innerSize / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    return (
      <div className="relative flex-shrink-0 flex items-center justify-center bg-black/30 border border-white/10 rounded-2xl p-3 group-hover:scale-105 transition-transform duration-500">
        <div className="relative rounded-full overflow-hidden" style={{ width: innerSize, height: innerSize }}>
          <img
            src={cloudinaryImage(program.image, 256)}
            alt={program.title}
            loading="lazy"
            decoding="async"
            width={innerSize}
            height={innerSize}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
            }`}
          />

          <svg
            width={innerSize}
            height={innerSize}
            className="absolute inset-0 -rotate-90 pointer-events-none"
          >
            <circle
              cx={innerSize / 2}
              cy={innerSize / 2}
              r={radius}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {isActive && (
              <circle
                cx={innerSize / 2}
                cy={innerSize / 2}
                r={radius}
                stroke="#ff6600"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                className="transition-all duration-1000"
              />
            )}
          </svg>
        </div>
      </div>
    );
  }
);

ProgramProgressRing.displayName = 'ProgramProgressRing';

const dayMeta = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const ScheduleList: React.FC<ScheduleListProps> = ({ onNavigateToProgram, onBack }) => {
  const [now, setNow] = useState(getChicagoDate());
  const [today, setToday] = useState(getChicagoDate());
  const [selectedDay, setSelectedDay] = useState(getChicagoDate().getDay());
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const chicagoNow = getChicagoDate();
      setNow(chicagoNow);
      setToday((prev) => (prev.getDate() !== chicagoNow.getDate() ? chicagoNow : prev));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const weekDays = useMemo(() => {
    const currentDay = today.getDay();

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);

      return {
        value: i,
        dayLabel: dayMeta[i],
        dateLabel: date
          .toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
          .toUpperCase(),
        fullLabel: date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        }),
        isToday: i === currentDay,
        isSunday: i === 0
      };
    });
  }, [today]);

  const selectedDayInfo = weekDays.find((d) => d.value === selectedDay) || weekDays[0];

  const currentSchedule = useMemo(() => {
    return SCHEDULES[selectedDay] || SCHEDULES[1];
  }, [selectedDay]);

  const sections = useMemo(() => {
    const groups: Record<string, Program[]> = {
      EARLY: [],
      MORNING: [],
      AFTERNOON: [],
      EVENING: [],
      LATE: []
    };

    currentSchedule.forEach((prog) => {
      const h = parseInt(prog.startTime.split(':')[0], 10);

      if (h < 6) groups.EARLY.push(prog);
      else if (h < 12) groups.MORNING.push(prog);
      else if (h < 18) groups.AFTERNOON.push(prog);
      else if (h < 22) groups.EVENING.push(prog);
      else groups.LATE.push(prog);
    });

    return groups;
  }, [currentSchedule]);

  const isLiveNow = (startStr: string, endStr: string) => {
    if (selectedDay !== now.getDay()) return false;

    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);

    const start = sH * 60 + sM;
    let end = eH * 60 + eM;

    if (end === 0 || end <= start) end = 24 * 60;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return nowMinutes >= start && nowMinutes < end;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  useEffect(() => {
    if (selectedDay !== getChicagoDate().getDay()) return;

    const scrollTimer = setTimeout(() => {
      const liveElement = document.querySelector('[data-live="true"]');
      if (liveElement) {
        liveElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

    return () => clearTimeout(scrollTimer);
  }, [selectedDay]);

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <section
      ref={listContainerRef}
      className="min-h-screen font-sans text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-white/60 hover:text-[#ff6600] transition-colors mb-6 text-xs font-normal uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
          </button>
        )}

        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-4 mb-6 border-b-2 border-[#ff6600] pb-6">
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Schedule
            </h1>
            <p className="text-white/60 font-normal uppercase tracking-wide text-sm mt-4 md:mt-0">
              {selectedDayInfo.isToday ? 'Today' : selectedDayInfo.dayLabel} • {selectedDayInfo.fullLabel}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto mb-10">
            <div className="flex min-w-max">
              {weekDays.map((day) => {
                const active = selectedDay === day.value;

                return (
                  <button
                    key={day.value}
                    onClick={() => setSelectedDay(day.value)}
                    className={`min-w-[96px] px-4 py-3 text-center border-r border-white/10 last:border-r-0 transition-all ${
                      active
                        ? 'bg-[#ff6600] text-white'
                        : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold tracking-wide">
                      {day.isToday ? 'TODAY' : day.isSunday ? 'SUN ✝' : day.dayLabel}
                    </div>
                    <div className="text-[18px] font-bold leading-tight">
                      {day.dateLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-white/60">
            <span className="text-white/30">Browse</span>

            {(Object.keys(sections) as string[]).map((title) => (
              <button
                key={title}
                onClick={() =>
                  document.getElementById(title)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
                }
                className="hover:text-[#ff6600] transition-colors"
              >
                {title === 'EARLY' && 'Early Hours'}
                {title === 'MORNING' && 'Morning'}
                {title === 'AFTERNOON' && 'Afternoon'}
                {title === 'EVENING' && 'Evening'}
                {title === 'LATE' && 'Late Night'}
              </button>
            ))}
          </div>
        </div>

        {(Object.entries(sections) as [string, Program[]][]).map(([title, items]) =>
          items.length > 0 ? (
            <div key={title} id={title} className="mb-16 md:mb-20 scroll-mt-24">
              <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight border-l-4 border-[#ff6600] pl-4">
                {title}
              </h3>

              <div className="space-y-5">
                {items.map((prog) => {
                  const active = isLiveNow(prog.startTime, prog.endTime);

                  return (
                    <div
                      key={prog.id}
                      data-live={active}
                      onClick={() => onNavigateToProgram(prog)}
                      className={`relative flex flex-col md:flex-row items-start p-6 transition-all cursor-pointer group rounded-2xl md:rounded-3xl border backdrop-blur ${
                        active
                          ? 'bg-orange-500/10 border-orange-500 shadow-xl shadow-orange-500/10'
                          : 'bg-white/5 border-white/10 opacity-80 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#ff6600] rounded-l-2xl md:rounded-l-3xl" />
                      )}

                      <div className="w-32 flex-shrink-0 flex flex-col mb-6 md:mb-0 pt-1">
                        <span
                          className={`text-2xl font-bold tracking-tight ${
                            active
                              ? 'text-[#ff6600]'
                              : 'text-white/50 group-hover:text-white'
                          }`}
                        >
                          {format12h(prog.startTime)}
                        </span>

                        {active && (
                          <div className="mt-3 inline-flex items-center justify-center bg-[#ff6600] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider w-24 rounded-full shadow-md">
                            ON AIR
                          </div>
                        )}
                      </div>

                      <div className="md:mx-8">
                        <ProgramProgressRing
                          program={prog}
                          isActive={active}
                          nowMinutes={nowMinutes}
                        />
                      </div>

                      <div className="flex-grow min-w-0 pt-1">
                        <h4 className={`text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-2 transition-all duration-300 ${
                          active ? 'text-[#ff6600]' : 'text-white group-hover:text-[#ff6600]'
                        }`}>
                          {prog.title}
                        </h4>

                        <p className="text-white/60 font-normal text-base mb-4 tracking-tight">
                          with {prog.host}
                        </p>

                        <p className="text-white/70 text-sm leading-relaxed font-normal max-w-2xl">
                          {prog.description}
                        </p>

                        {active && (
                          <div className="mt-6 flex items-center space-x-3">
                            <div className="h-1 w-10 bg-[#ff6600] animate-pulse"></div>
                            <span className="text-[10px] font-semibold text-[#ff6600] uppercase tracking-wider">
                              Listening now live
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default ScheduleList;
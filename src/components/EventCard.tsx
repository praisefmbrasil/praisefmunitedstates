
import React from 'react';
import { MapPin, Calendar, ExternalLink, Ticket } from 'lucide-react';

interface EventProps {
  event: {
    datetime: string;
    venue: {
      name: string;
      city: string;
      region: string;
      country: string;
    };
    url: string;
  };
}

const EventCard: React.FC<EventProps> = ({ event }) => {
  const date = new Date(event.datetime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white dark:bg-black border border-gray-100 dark:border-white/5 group hover:border-[#ff6600] transition-all shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 p-3 min-w-[80px] border border-gray-100 dark:border-white/10">
          <Calendar className="w-5 h-5 text-[#ff6600] mb-1" />
          <span className="text-[11px] font-black uppercase tracking-tighter dark:text-white">{formattedDate}</span>
        </div>
        <div>
          <h4 className="text-xl font-medium dark:text-white leading-none mb-2 uppercase tracking-tighter">
            {event.venue.name}
          </h4>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest flex items-center font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#ff6600]" /> 
            {event.venue.city}, {event.venue.region} {event.venue.country !== 'United States' ? event.venue.country : ''}
          </p>
          <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-[0.2em]">Doors: {formattedTime}</p>
        </div>
      </div>
      <a 
        href={event.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-6 sm:mt-0 flex items-center justify-center space-x-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#ff6600] dark:hover:bg-[#ff6600] hover:text-white transition-all shadow-lg active:scale-95"
      >
        <Ticket className="w-4 h-4" />
        <span>Tickets</span>
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    </div>
  );
};

export default EventCard;

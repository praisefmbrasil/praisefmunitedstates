type ProgramRingProps = {
  title: string;
  image: string;
  progress: number; // 0 a 100
  isLive?: boolean;
};

export function ProgramRing({
  title,
  image,
  progress,
  isLive,
}: ProgramRingProps) {
  const radius = 46;
  const size = 112;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.max(0, Math.min(progress, 100));
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-[120px] flex-shrink-0">
      <div className="relative w-28 h-28">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90 pointer-events-none"
          aria-hidden="true"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#2a2a2a"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ff6600"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <img
          src={image}
          alt={title}
          className="absolute inset-2 w-[96px] h-[96px] rounded-full object-cover"
        />

        {isLive && (
          <span className="absolute bottom-1 right-1 bg-black text-white text-[10px] px-2 py-0.5 rounded">
            LIVE
          </span>
        )}
      </div>

      <span className="mt-2 text-sm text-center text-white leading-tight line-clamp-2 max-w-[120px]">
        {title}
      </span>
    </div>
  );
}

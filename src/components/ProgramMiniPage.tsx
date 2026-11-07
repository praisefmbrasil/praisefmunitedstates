interface ProgramMiniPageProps {
  program: any;
  queue: any[];
  liveMetadata: any;
  trackHistory: any[];
  isPlaying: boolean;
  onListenClick: () => void;
  onBack: () => void;
  onViewSchedule: () => void;
}

export default function ProgramMiniPage({
  program,
  queue,
  liveMetadata,
  trackHistory,
  isPlaying,
  onListenClick,
  onBack,
  onViewSchedule,
}: ProgramMiniPageProps) {
  return null;
}
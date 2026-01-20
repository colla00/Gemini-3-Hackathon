import { Activity } from 'lucide-react';

export const LiveBadge = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg border border-primary/30">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
      <span className="text-xs font-bold text-white tracking-wide uppercase">
        Live
      </span>
    </div>
  );
};

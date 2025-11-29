export const LiveBadge = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-risk-high animate-pulse-live shadow-lg">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <span className="text-sm font-bold text-white tracking-wider uppercase">
        Live System
      </span>
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

export const LandingSkeleton = () => {
  return (
    <div className="min-h-screen bg-foreground">
      {/* Nav */}
      <header className="border-b border-primary-foreground/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-primary-foreground/10" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20 bg-primary-foreground/10" />
            <Skeleton className="h-8 w-20 bg-primary-foreground/10" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 space-y-6">
        <Skeleton className="h-7 w-64 rounded-full bg-primary/20" />
        <Skeleton className="h-14 w-[500px] bg-primary-foreground/10" />
        <Skeleton className="h-6 w-96 bg-primary-foreground/10" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 w-44 rounded-xl bg-primary/30" />
          <Skeleton className="h-12 w-56 rounded-xl bg-primary-foreground/10" />
        </div>
        <div className="grid grid-cols-4 gap-px mt-12 rounded-xl overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-foreground/80 p-5 text-center space-y-2">
              <Skeleton className="h-8 w-20 mx-auto bg-primary/20" />
              <Skeleton className="h-4 w-24 mx-auto bg-primary-foreground/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

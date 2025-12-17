import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header */}
      <header className="border-b border-border/40 bg-secondary/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-background px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-96 mb-4" />
          <Skeleton className="h-5 w-[500px]" />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-lg border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const PresentationSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64 mb-8" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded" />
              <Skeleton className="h-24 rounded" />
              <Skeleton className="h-24 rounded" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export const AdminSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48 flex-1" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AIToolsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-secondary/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-secondary/30 border-b border-border/40 px-6 py-10">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <Skeleton className="h-5 w-40 mx-auto rounded-full" />
          <Skeleton className="h-9 w-80 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
      </div>

      {/* Module grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-36 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-full rounded-lg mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

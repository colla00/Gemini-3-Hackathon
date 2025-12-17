import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b border-border/40 bg-secondary/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </header>

      {/* Stats Bar Skeleton */}
      <div className="border-b border-border/40 bg-secondary/30 px-4 py-2">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Patient List Skeleton */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <PatientCardSkeleton key={i} />
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export const PatientCardSkeleton = () => (
  <Card className="p-4">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
    </div>
  </Card>
);

export const ChartSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24 mb-4" />
    <div className="flex items-end gap-1 h-32">
      {[40, 65, 45, 80, 55, 70, 50, 75, 60, 85].map((h, i) => (
        <Skeleton 
          key={i} 
          className="flex-1 rounded-t" 
          style={{ height: `${h}%` }} 
        />
      ))}
    </div>
  </div>
);

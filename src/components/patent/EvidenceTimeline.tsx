import { useState, useEffect } from 'react';
import { 
  Clock, Upload, UserCheck, Eye, FileText, Image as ImageIcon, 
  Download, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface EvidenceTimelineProps {
  documentHash: string;
  className?: string;
}

const activityConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  view: { 
    icon: Eye, 
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    label: 'Document Viewed'
  },
  attestation: { 
    icon: UserCheck, 
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    label: 'Attestation'
  },
  screenshot_upload: { 
    icon: ImageIcon, 
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    label: 'Screenshot Upload'
  },
  pdf_export: { 
    icon: Download, 
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    label: 'PDF Export'
  },
  document_update: { 
    icon: FileText, 
    color: 'text-accent bg-accent/10 border-accent/30',
    label: 'Document Update'
  }
};

export const EvidenceTimeline = ({ documentHash, className }: EvidenceTimelineProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: queryError } = await supabase
          .from('patent_activities')
          .select('*')
          .eq('document_hash', documentHash)
          .order('created_at', { ascending: false })
          .limit(50);

        if (queryError) throw queryError;
        setActivities((data || []) as Activity[]);
      } catch (err) {
        console.error('Failed to load activities:', err);
        setError('Failed to load activity timeline');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('patent_activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'patent_activities',
          filter: `document_hash=eq.${documentHash}`
        },
        (payload) => {
          setActivities(prev => [payload.new as Activity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentHash]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm py-4", className)}>
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground text-sm", className)}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.activity_type] || {
            icon: Clock,
            color: 'text-muted-foreground bg-muted border-border',
            label: activity.activity_type
          };
          const Icon = config.icon;

          return (
            <div 
              key={activity.id}
              className="relative flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 bg-card z-10",
                config.color
              )}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>

                {/* Metadata display */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <span 
                        key={key}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground"
                      >
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, Vote, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  poll_type: string;
  options: PollOption[];
  is_active: boolean;
}

interface LivePollsProps {
  sessionId?: string;
  isPresenter?: boolean;
}

export const LivePolls = ({ sessionId, isPresenter = false }: LivePollsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voterId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  // Fetch active poll and subscribe to updates
  useEffect(() => {
    if (!sessionId) return;

    const fetchActivePoll = async () => {
      const { data: polls, error } = await supabase
        .from('polls')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!error && polls) {
        // Fetch vote counts
        const { data: responses } = await supabase
          .from('poll_responses')
          .select('selected_options')
          .eq('poll_id', polls.id);

        const options = (polls.options as any[]).map(opt => ({
          ...opt,
          votes: responses?.filter(r => 
            (r.selected_options as string[]).includes(opt.id)
          ).length || 0
        }));

        setActivePoll({ ...polls, options });
        
        // Check if user already voted
        const { data: existingVote } = await supabase
          .from('poll_responses')
          .select('id')
          .eq('poll_id', polls.id)
          .eq('voter_id', voterId)
          .single();
        
        setHasVoted(!!existingVote);
      } else {
        setActivePoll(null);
      }
    };

    fetchActivePoll();

    // Subscribe to poll updates
    const channel = supabase
      .channel('live-polls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'polls',
          filter: `session_id=eq.${sessionId}`,
        },
        () => fetchActivePoll()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poll_responses',
        },
        () => fetchActivePoll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, voterId]);

  const handleVote = async () => {
    if (!activePoll || selectedOptions.length === 0) return;

    const { error } = await supabase.from('poll_responses').insert({
      poll_id: activePoll.id,
      voter_id: voterId,
      selected_options: selectedOptions,
    });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already voted",
          description: "You have already submitted your response.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit vote. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setHasVoted(true);
      toast({
        title: "Vote submitted!",
        description: "Thank you for participating.",
      });
    }
  };

  const toggleOption = (optionId: string) => {
    if (activePoll?.poll_type === 'single_choice' || activePoll?.poll_type === 'yes_no') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const totalVotes = activePoll?.options.reduce((sum, opt) => sum + opt.votes, 0) || 0;

  if (!activePoll && !isPresenter) {
    return null;
  }

  if (!isOpen && activePoll) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all animate-pulse print:hidden"
      >
        <Vote className="w-4 h-4" />
        <span className="text-sm font-medium">Live Poll</span>
      </button>
    );
  }

  if (!activePoll) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80 bg-card border border-border shadow-2xl rounded-xl overflow-hidden print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4" />
          <span className="font-semibold text-sm">Live Poll</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded hover:bg-primary-foreground/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Poll Content */}
      <div className="p-4">
        <p className="text-sm font-medium text-foreground mb-4">{activePoll.question}</p>

        <div className="space-y-2">
          {activePoll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = selectedOptions.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => !hasVoted && toggleOption(option.id)}
                disabled={hasVoted}
                className={cn(
                  "w-full relative p-3 rounded-lg border text-left transition-all",
                  hasVoted 
                    ? "cursor-default" 
                    : "hover:border-primary cursor-pointer",
                  isSelected && !hasVoted
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary"
                )}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div 
                    className="absolute inset-0 bg-primary/20 rounded-lg transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!hasVoted && (
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </div>
                    )}
                    <span className="text-sm text-foreground">{option.text}</span>
                  </div>
                  {hasVoted && (
                    <span className="text-xs font-medium text-primary">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!hasVoted ? (
          <Button 
            onClick={handleVote}
            disabled={selectedOptions.length === 0}
            className="w-full mt-4"
          >
            Submit Vote
          </Button>
        ) : (
          <p className="text-center text-xs text-muted-foreground mt-4">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''} total
          </p>
        )}
      </div>
    </div>
  );
};

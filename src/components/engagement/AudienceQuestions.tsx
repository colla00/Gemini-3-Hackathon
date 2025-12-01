import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Send, ThumbsUp, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  asked_by: string;
  is_answered: boolean;
  answer: string | null;
  upvotes: number;
  slide_context: string | null;
  created_at: string;
}

interface AudienceQuestionsProps {
  sessionId?: string;
  currentSlide?: string;
  isPresenter?: boolean;
}

export const AudienceQuestions = ({ 
  sessionId, 
  currentSlide, 
  isPresenter = false 
}: AudienceQuestionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [askedBy, setAskedBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch questions and subscribe to realtime updates
  useEffect(() => {
    if (!sessionId) return;

    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('audience_questions')
        .select('*')
        .eq('session_id', sessionId)
        .order('upvotes', { ascending: false });

      if (!error && data) {
        setQuestions(data);
      }
    };

    fetchQuestions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('audience-questions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audience_questions',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !sessionId) return;

    setIsLoading(true);
    const { error } = await supabase.from('audience_questions').insert({
      session_id: sessionId,
      question: newQuestion.trim(),
      asked_by: askedBy.trim() || 'Anonymous',
      slide_context: currentSlide,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewQuestion('');
      toast({
        title: "Question submitted!",
        description: "The presenter will see your question.",
      });
    }
    setIsLoading(false);
  };

  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    const { error } = await supabase
      .from('audience_questions')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', questionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAnswered = async (questionId: string) => {
    const { error } = await supabase
      .from('audience_questions')
      .update({ is_answered: true })
      .eq('id', questionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as answered.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground shadow-lg hover:bg-secondary/80 transition-all print:hidden"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">Q&A</span>
        {questions.filter(q => !q.is_answered).length > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary text-primary-foreground">
            {questions.filter(q => !q.is_answered).length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 w-80 bg-card border border-border shadow-2xl rounded-xl overflow-hidden print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-secondary border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Audience Q&A</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded hover:bg-background transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Questions List */}
      <div className="max-h-64 overflow-auto p-3 space-y-2">
        {questions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No questions yet. Be the first to ask!
          </p>
        ) : (
          questions.map((q) => (
            <div 
              key={q.id} 
              className={cn(
                "p-2.5 rounded-lg border",
                q.is_answered 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-secondary border-border"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.question}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    — {q.asked_by}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!q.is_answered && (
                    <button
                      onClick={() => handleUpvote(q.id, q.upvotes)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-background transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{q.upvotes}</span>
                    </button>
                  )}
                  {isPresenter && !q.is_answered && (
                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      className="p-1 rounded hover:bg-risk-low/20 text-risk-low transition-colors"
                      title="Mark as answered"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {q.is_answered && (
                    <span className="text-[10px] text-risk-low font-medium">Answered</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Form */}
      <form onSubmit={handleSubmitQuestion} className="p-3 border-t border-border space-y-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={askedBy}
            onChange={(e) => setAskedBy(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 px-3 py-1.5 text-xs bg-secondary border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
          <Button type="submit" size="sm" disabled={isLoading || !newQuestion.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Star, Send, MessageSquare, ThumbsUp, ThumbsDown, 
  Minus, X, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Validation schema for feedback
const feedbackSchema = z.object({
  message: z.string().trim().max(1000, "Message must be under 1000 characters").optional(),
  name: z.string().trim().max(100, "Name must be under 100 characters").optional(),
});

interface FeedbackPanelProps {
  sessionId?: string;
  currentSlide?: string;
}

export const FeedbackPanel = ({ sessionId, currentSlide }: FeedbackPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      toast({
        title: "Session not found",
        description: "Please join a presentation session first.",
        variant: "destructive",
      });
      return;
    }

    // Validate input
    const validation = feedbackSchema.safeParse({
      message: message || undefined,
      name: name || undefined,
    });

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid input";
      setValidationError(errorMsg);
      toast({
        title: "Validation Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setValidationError(null);
    setIsLoading(true);
    const { error } = await supabase.from('feedback').insert({
      session_id: sessionId,
      slide_id: currentSlide,
      feedback_type: feedbackType || 'neutral',
      rating: rating || null,
      message: validation.data.message || null,
      submitted_by: validation.data.name || 'Anonymous',
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
      });
    }
    setIsLoading(false);
  };

  const quickFeedback = async (type: 'positive' | 'neutral' | 'negative') => {
    if (!sessionId) return;
    
    await supabase.from('feedback').insert({
      session_id: sessionId,
      slide_id: currentSlide,
      feedback_type: type,
    });
    
    toast({
      title: "Feedback recorded",
      description: type === 'positive' ? "Thanks for the thumbs up!" : "Thanks for your feedback!",
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={() => quickFeedback('positive')}
          className="p-2 rounded-full bg-risk-low/20 border border-risk-low/30 text-risk-low hover:bg-risk-low/30 transition-colors"
          title="This is helpful"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">Give Feedback</span>
        </button>
        <button
          onClick={() => quickFeedback('negative')}
          className="p-2 rounded-full bg-risk-high/20 border border-risk-high/30 text-risk-high hover:bg-risk-high/30 transition-colors"
          title="Could be improved"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-80 bg-card border border-border shadow-2xl rounded-xl p-6 text-center print:hidden">
        <CheckCircle className="w-12 h-12 mx-auto text-risk-low mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your feedback helps us improve the presentation.
        </p>
        <Button variant="outline" onClick={() => { setIsOpen(false); setIsSubmitted(false); }}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-96 bg-card border border-border shadow-2xl rounded-xl overflow-hidden print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-secondary border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Share Your Feedback</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded hover:bg-background transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Quick Reaction */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">How's the presentation?</p>
          <div className="flex justify-center gap-4">
            {[
              { type: 'positive' as const, icon: ThumbsUp, label: 'Great', color: 'risk-low' },
              { type: 'neutral' as const, icon: Minus, label: 'Okay', color: 'warning' },
              { type: 'negative' as const, icon: ThumbsDown, label: 'Needs work', color: 'risk-high' },
            ].map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => setFeedbackType(type)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                  feedbackType === type
                    ? `bg-${color}/20 border-${color}/40 text-${color}`
                    : "border-border hover:bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Rate the content</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    star <= rating 
                      ? "text-warning fill-warning" 
                      : "text-muted-foreground"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share specific feedback or suggestions..."
            maxLength={1000}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
            rows={3}
          />
          <div className="flex justify-between mt-1">
            {validationError && (
              <span className="text-[10px] text-destructive">{validationError}</span>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto">{message.length}/1000</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={100}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
      </form>
    </div>
  );
};

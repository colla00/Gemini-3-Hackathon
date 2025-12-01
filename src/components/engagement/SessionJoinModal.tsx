import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Users, Key, ArrowRight, X, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresentationSession } from '@/hooks/usePresentationSession';
import { useToast } from '@/hooks/use-toast';

interface SessionJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPresenter?: boolean;
}

export const SessionJoinModal = ({ isOpen, onClose, isPresenter = false }: SessionJoinModalProps) => {
  const [sessionKey, setSessionKey] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [copied, setCopied] = useState(false);
  const { session, isLoading, createSession, joinSession } = usePresentationSession();
  const { toast } = useToast();

  const handleCreateSession = async () => {
    const newSession = await createSession(presenterName || 'Presenter');
    if (newSession) {
      toast({
        title: "Session created!",
        description: `Share code: ${newSession.session_key}`,
      });
    }
  };

  const handleJoinSession = async () => {
    if (!sessionKey.trim()) return;
    
    const joined = await joinSession(sessionKey.trim());
    if (joined) {
      toast({
        title: "Joined session!",
        description: "You're now connected to the presentation.",
      });
      onClose();
    } else {
      toast({
        title: "Session not found",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = () => {
    if (session?.session_key) {
      navigator.clipboard.writeText(session.session_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              {isPresenter ? 'Start Session' : 'Join Presentation'}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-background transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {isPresenter ? (
            session ? (
              // Session Created - Show Code
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-risk-low/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-risk-low" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Session Active</h3>
                  <p className="text-sm text-muted-foreground">
                    Share this code with your audience
                  </p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Session Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-mono font-bold text-primary tracking-wider">
                      {session.session_key}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 rounded hover:bg-background transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-risk-low" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button onClick={onClose} className="w-full">
                  Start Presenting
                </Button>
              </div>
            ) : (
              // Create Session Form
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={presenterName}
                    onChange={(e) => setPresenterName(e.target.value)}
                    placeholder="Dr. Smith"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button 
                  onClick={handleCreateSession} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Session'}
                  <Share2 className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This will generate a code that audience members can use to join
                </p>
              </div>
            )
          ) : (
            // Join Session Form
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Enter Session Code
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={sessionKey}
                      onChange={(e) => setSessionKey(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground font-mono uppercase"
                      maxLength={16}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleJoinSession} 
                className="w-full" 
                disabled={isLoading || !sessionKey.trim()}
              >
                {isLoading ? 'Joining...' : 'Join Session'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Ask the presenter for the session code to join
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

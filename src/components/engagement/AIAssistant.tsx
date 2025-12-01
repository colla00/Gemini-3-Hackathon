import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, Send, Bot, User, X, Minimize2, 
  Maximize2, Sparkles, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is SHAP and how does it work?",
  "How are fall risk scores calculated?",
  "What is human-in-the-loop design?",
  "Explain the Braden scale for pressure injuries",
];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/methodology-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      streamChat(input.trim());
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (!isLoading) {
      streamChat(question);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 print:hidden"
        title="Ask AI Assistant"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed z-50 bg-card border border-border shadow-2xl rounded-xl overflow-hidden transition-all print:hidden",
        isMinimized 
          ? "bottom-20 right-4 w-72 h-12" 
          : "bottom-20 right-4 w-96 h-[500px] max-h-[70vh]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          <span className="font-semibold text-sm">AI Methodology Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded hover:bg-primary-foreground/20 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-[calc(100%-120px)] p-3" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <Bot className="w-10 h-10 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about SHAP, risk prediction, or clinical methodology!
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Suggested questions:</p>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="w-full text-left text-xs p-2 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] p-2.5 rounded-lg text-sm",
                        msg.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    </div>
                    <div className="bg-secondary p-2.5 rounded-lg">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about SHAP, risk factors..."
                className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

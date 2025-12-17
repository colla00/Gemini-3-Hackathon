import { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['G', 'H'], description: 'Go to Home', category: 'Navigation' },
  { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['G', 'P'], description: 'Go to Presentation', category: 'Navigation' },
  
  // Dashboard
  { keys: ['1-7'], description: 'Switch dashboard views', category: 'Dashboard' },
  { keys: ['R'], description: 'Refresh data', category: 'Dashboard' },
  { keys: ['S'], description: 'Open settings', category: 'Dashboard' },
  { keys: ['/'], description: 'Focus search', category: 'Dashboard' },
  
  // Presentation
  { keys: ['→', 'Space'], description: 'Next slide', category: 'Presentation' },
  { keys: ['←'], description: 'Previous slide', category: 'Presentation' },
  { keys: ['Esc'], description: 'Exit presentation', category: 'Presentation' },
  { keys: ['F'], description: 'Toggle fullscreen', category: 'Presentation' },
  
  // General
  { keys: ['?'], description: 'Show this help', category: 'General' },
  { keys: ['Esc'], description: 'Close modal/dialog', category: 'General' },
];

interface KeyboardShortcutsHelpProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const KeyboardShortcutsHelp = ({ open, onOpenChange }: KeyboardShortcutsHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const isControlled = open !== undefined;
  const showModal = isControlled ? open : isOpen;
  const setShowModal = isControlled ? onOpenChange! : setIsOpen;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowModal]);

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowModal(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Quick access keys to navigate and control the dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50"
                      >
                        <span className="text-sm text-muted-foreground">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, ki) => (
                            <span key={ki}>
                              <kbd className="px-2 py-1 text-xs font-mono bg-secondary border border-border rounded">
                                {key}
                              </kbd>
                              {ki < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-muted-foreground">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-secondary border border-border rounded">?</kbd> anywhere to show this help
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

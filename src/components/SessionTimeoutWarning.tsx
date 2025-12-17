import { Clock, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SessionTimeoutWarningProps {
  open: boolean;
  remainingTime: number;
  formatTime: (seconds: number) => string;
  onExtend: () => void;
}

export const SessionTimeoutWarning = ({
  open,
  remainingTime,
  formatTime,
  onExtend,
}: SessionTimeoutWarningProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Your session will expire in{' '}
              <span className="font-mono font-bold text-warning">
                {formatTime(remainingTime)}
              </span>{' '}
              due to inactivity.
            </p>
            <p>
              Click the button below or move your mouse to stay signed in.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onExtend}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

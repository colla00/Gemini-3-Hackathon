import { Activity, LogOut, Settings, Presentation, Monitor, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LiveBadge } from './LiveBadge';
import { InfoModal } from './InfoModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Header = () => {
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-border/40 bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 shadow-sm">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground">
              VitaSignal<sup className="text-[7px] align-super">™</sup> Dashboard
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold tracking-wide">
              Clinical Intelligence · Research Prototype
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          {/* Self-Paced Walkthrough - Available to all users */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" asChild>
                  <Link to="/presentation">
                    <Play className="h-4 w-4 text-primary" />
                    <span className="hidden md:inline text-xs">Walkthrough</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Self-Paced Walkthrough</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Presenter Dashboard - Admin only */}
          {isAdmin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <Link to="/presentation?mode=presenter">
                      <Monitor className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Presenter Dashboard (Admin)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <ThemeToggle />
          
          <InfoModal />
          
          <LiveBadge />

          {/* Logout Button */}
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline text-xs">Sign out</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
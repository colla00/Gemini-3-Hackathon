import { useState } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSettings } from '@/hooks/useSettings';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'high-risk' | 'medium-risk' | 'intervention' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  patientId?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'high-risk',
    title: 'High Risk Alert',
    message: 'Patient 849201 falls risk increased to 76%',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    read: false,
    patientId: '849201',
  },
  {
    id: '2',
    type: 'high-risk',
    title: 'Critical Risk Level',
    message: 'Patient 921847 HAPI risk now HIGH (72%)',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    read: false,
    patientId: '921847',
  },
  {
    id: '3',
    type: 'intervention',
    title: 'Intervention Reminder',
    message: 'Bed alarm check due for Room 19',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    read: false,
  },
  {
    id: '4',
    type: 'medium-risk',
    title: 'Risk Change',
    message: 'Patient 847203 moved to MODERATE risk',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    read: true,
    patientId: '847203',
  },
  {
    id: '5',
    type: 'success',
    title: 'Intervention Effective',
    message: 'Patient 834521 falls risk reduced by 15%',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
    patientId: '834521',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'high-risk':
      return <AlertCircle className="w-4 h-4 text-risk-high" />;
    case 'medium-risk':
      return <AlertTriangle className="w-4 h-4 text-risk-medium" />;
    case 'intervention':
      return <Clock className="w-4 h-4 text-primary" />;
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
  }
};

const getNotificationBg = (type: Notification['type'], read: boolean) => {
  if (read) return 'bg-muted/10';
  switch (type) {
    case 'high-risk':
      return 'bg-risk-high/10 border-l-2 border-l-risk-high';
    case 'medium-risk':
      return 'bg-risk-medium/10 border-l-2 border-l-risk-medium';
    case 'intervention':
      return 'bg-primary/10 border-l-2 border-l-primary';
    case 'success':
      return 'bg-risk-low/10 border-l-2 border-l-risk-low';
  }
};

export const NotificationsDropdown = () => {
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Filter notifications based on settings
  const filteredNotifications = notifications.filter(n => {
    if (!settings.notifications.enabled) return false;
    if (!settings.notifications.highRiskAlerts && (n.type === 'high-risk' || n.type === 'medium-risk')) return false;
    if (!settings.notifications.interventionReminders && n.type === 'intervention') return false;
    return true;
  });

  if (!settings.notifications.enabled) {
    return (
      <button 
        className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground transition-colors relative"
        title="Notifications disabled"
      >
        <Bell className="w-4 h-4 opacity-50" />
      </button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-risk-high text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-secondary border-border shadow-xl" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-risk-high/20 text-risk-high text-[10px] font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5"
              >
                Mark all read
              </button>
              <button
                onClick={handleClearAll}
                className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-muted/20 transition-colors cursor-pointer group",
                    getNotificationBg(notification.type, notification.read)
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-xs font-medium truncate",
                          notification.read ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className={cn(
                        "text-[11px] mt-0.5 line-clamp-2",
                        notification.read ? "text-muted-foreground/70" : "text-muted-foreground"
                      )}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-muted-foreground/60">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {notification.patientId && (
                          <span className="text-[9px] text-primary/70">
                            MRN: {notification.patientId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-2 border-t border-border/50 bg-muted/10">
            <button className="w-full py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors">
              View All Notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

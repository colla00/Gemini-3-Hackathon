import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export type AuditAction = 
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'role_change';

export type AuditResourceType = 
  | 'walkthrough_request'
  | 'user_role'
  | 'user_profile'
  | 'presentation_session'
  | 'handoff_report'
  | 'patent_documentation'
  | 'about_page'
  | 'presentation_page';

interface AuditLogEntry {
  action: AuditAction;
  resource_type: AuditResourceType;
  resource_id?: string;
  details?: Record<string, string | number | boolean | null>;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = async (entry: AuditLogEntry) => {
    if (!user) {
      console.warn('Audit log: No user context available');
      return;
    }

    try {
      // Use edge function to capture IP address
      const { data, error } = await supabase.functions.invoke('log-audit', {
        body: {
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details,
        }
      });

      if (error) {
        console.error('Failed to write audit log via edge function:', error);
        // Fallback to direct insert (without IP)
        await fallbackLogAction(entry);
      } else {
        console.log('Audit log created with IP tracking:', data?.id);
      }
    } catch (err) {
      console.error('Audit log error:', err);
      // Fallback to direct insert (without IP)
      await fallbackLogAction(entry);
    }
  };

  // Fallback if edge function fails - logs without IP address
  const fallbackLogAction = async (entry: AuditLogEntry) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details as Json,
          ip_address: null, // Cannot capture IP from client-side
        }]);

      if (error) {
        console.error('Fallback audit log failed:', error);
      }
    } catch (err) {
      console.error('Fallback audit log error:', err);
    }
  };

  return { logAction };
};

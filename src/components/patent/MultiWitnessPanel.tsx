import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Clock, CheckCircle2, AlertCircle, Loader2, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AttestationGroup {
  id: string;
  document_hash: string;
  required_witnesses: number;
  status: 'pending' | 'complete';
  created_at: string;
  completed_at: string | null;
}

interface Attestation {
  id: string;
  witness_name: string;
  witness_title: string;
  organization: string | null;
  attested_at: string;
  attestation_group_id: string | null;
}

interface MultiWitnessPanelProps {
  documentHash: string;
  onStartAttestation: (groupId: string) => void;
  className?: string;
}

export const MultiWitnessPanel = ({ 
  documentHash, 
  onStartAttestation,
  className 
}: MultiWitnessPanelProps) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<AttestationGroup[]>([]);
  const [attestations, setAttestations] = useState<Record<string, Attestation[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [requiredWitnesses, setRequiredWitnesses] = useState(2);

  useEffect(() => {
    loadData();
  }, [documentHash]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load attestation groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('attestation_groups')
        .select('*')
        .eq('document_hash', documentHash)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;
      setGroups((groupsData || []) as AttestationGroup[]);

      // Load attestations for each group
      if (groupsData && groupsData.length > 0) {
        const groupIds = groupsData.map(g => g.id);
        const { data: attestData, error: attestError } = await supabase
          .from('patent_attestations')
          .select('id, witness_name, witness_title, organization, attested_at, attestation_group_id')
          .in('attestation_group_id', groupIds);

        if (attestError) throw attestError;

        // Group attestations by group_id
        const grouped: Record<string, Attestation[]> = {};
        (attestData || []).forEach((a: Attestation) => {
          if (a.attestation_group_id) {
            if (!grouped[a.attestation_group_id]) grouped[a.attestation_group_id] = [];
            grouped[a.attestation_group_id].push(a);
          }
        });
        setAttestations(grouped);
      }
    } catch (err) {
      console.error('Failed to load multi-witness data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createAttestationGroup = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('attestation_groups')
        .insert({
          document_hash: documentHash,
          document_version: '1.1.0',
          required_witnesses: requiredWitnesses,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('patent_activities').insert({
        document_hash: documentHash,
        activity_type: 'attestation',
        title: 'Multi-witness attestation started',
        description: `Requires ${requiredWitnesses} witnesses to complete`,
        metadata: { group_id: data.id, required_witnesses: requiredWitnesses },
        created_by: user?.id
      });

      setGroups(prev => [data as AttestationGroup, ...prev]);
      toast({
        title: 'Attestation Group Created',
        description: `Requires ${requiredWitnesses} witnesses to complete.`
      });
    } catch (err) {
      console.error('Failed to create attestation group:', err);
      toast({
        title: 'Error',
        description: 'Failed to create attestation group.',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getProgressPercentage = (group: AttestationGroup) => {
    const count = attestations[group.id]?.length || 0;
    return Math.min((count / group.required_witnesses) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-6", className)}>
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-foreground">Multi-Witness Attestations</h3>
        </div>
      </div>

      {/* Create New Group */}
      <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
        <p className="text-xs text-muted-foreground mb-3">
          Start a new multi-witness attestation that requires multiple witnesses to sign before it's considered complete.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Required witnesses:</label>
            <select
              value={requiredWitnesses}
              onChange={(e) => setRequiredWitnesses(Number(e.target.value))}
              className="px-2 py-1 rounded bg-secondary border border-border text-xs"
              disabled={isCreating}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <Button
            size="sm"
            onClick={createAttestationGroup}
            disabled={isCreating}
            className="gap-1"
          >
            {isCreating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            Start Multi-Witness
          </Button>
        </div>
      </div>

      {/* Existing Groups */}
      {groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map(group => {
            const groupAttestations = attestations[group.id] || [];
            const progress = getProgressPercentage(group);
            const isComplete = group.status === 'complete' || groupAttestations.length >= group.required_witnesses;

            return (
              <div 
                key={group.id}
                className={cn(
                  "p-4 rounded-lg border",
                  isComplete 
                    ? "bg-risk-low/5 border-risk-low/30" 
                    : "bg-card border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-risk-low" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isComplete ? 'Complete' : 'Awaiting Witnesses'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {groupAttestations.length} of {group.required_witnesses} witnesses signed
                      </p>
                    </div>
                  </div>
                  {!isComplete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStartAttestation(group.id)}
                      className="gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Add Witness
                    </Button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-3">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete ? "bg-risk-low" : "bg-indigo-500"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Witness list */}
                {groupAttestations.length > 0 && (
                  <div className="space-y-2">
                    {groupAttestations.map((att, idx) => (
                      <div 
                        key={att.id}
                        className="flex items-center gap-2 p-2 rounded bg-secondary/50"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-indigo-500">{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {att.witness_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {att.witness_title}{att.organization && ` • ${att.organization}`}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(att.attested_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground mt-2">
                  Created {new Date(group.created_at).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">
          No multi-witness attestations yet. Create one above to require multiple witnesses.
        </p>
      )}
    </div>
  );
};

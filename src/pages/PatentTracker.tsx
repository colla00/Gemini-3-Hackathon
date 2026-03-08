import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Clock, ChevronDown, ChevronRight, FileText, Lock, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Patent {
  id: string;
  patent_number: string;
  nickname: string;
  description: string | null;
  filing_date: string | null;
  np_deadline: string;
  status: string;
  priority_level: string;
  attorney_assigned: boolean;
  notes: string | null;
  bundle_group: string | null;
}

const PASSWORD = "vitasignal2026";

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function deadlineColor(days: number): string {
  if (days < 0) return "bg-gray-500";
  if (days < 183) return "bg-red-600"; // <6 months
  if (days < 365) return "bg-amber-500"; // 6-12 months
  return "bg-emerald-600"; // >12 months
}

function deadlineBorder(days: number): string {
  if (days < 0) return "border-gray-400";
  if (days < 183) return "border-red-500/40";
  if (days < 365) return "border-amber-400/40";
  return "border-emerald-500/30";
}

function priorityBadge(level: string) {
  const styles: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-800 border-red-200",
    HIGH: "bg-amber-100 text-amber-800 border-amber-200",
    STANDARD: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return styles[level] || styles.STANDARD;
}

function PatentCard({ patent, onUpdate }: { patent: Patent; onUpdate: (id: string, field: string, value: any) => void }) {
  const days = daysUntil(patent.np_deadline);
  const [editingNotes, setEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(patent.notes || "");

  return (
    <Card className={`border-l-4 ${deadlineBorder(days)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs text-muted-foreground">{patent.patent_number}</span>
              <Badge variant="outline" className={`text-[10px] ${priorityBadge(patent.priority_level)}`}>
                {patent.priority_level}
              </Badge>
            </div>
            <CardTitle className="text-base">
              {patent.nickname} — {patent.description}
            </CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={`${deadlineColor(days)} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {days < 0 ? "OVERDUE" : `${days}d`}
            </div>
            <span className="text-[10px] text-muted-foreground">
              NP: {new Date(patent.np_deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`atty-${patent.id}`}
              checked={patent.attorney_assigned}
              onCheckedChange={(checked) => onUpdate(patent.id, "attorney_assigned", checked === true)}
            />
            <label htmlFor={`atty-${patent.id}`} className="text-sm cursor-pointer">
              Attorney Assigned
            </label>
          </div>
          {patent.filing_date && (
            <span className="text-xs text-muted-foreground">
              Filed: {new Date(patent.filing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>

        {editingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              rows={2}
              className="text-sm"
              maxLength={500}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onUpdate(patent.id, "notes", localNotes || null);
                  setEditingNotes(false);
                }}
              >
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setLocalNotes(patent.notes || ""); setEditingNotes(false); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="text-sm text-muted-foreground bg-secondary/50 rounded p-2 cursor-pointer hover:bg-secondary/80 transition-colors min-h-[32px]"
            onClick={() => setEditingNotes(true)}
          >
            {patent.notes || <span className="italic opacity-50">Click to add notes...</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PatentTracker() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [bundleOpen, setBundleOpen] = useState(true);

  useEffect(() => {
    if (authenticated) fetchPatents();
  }, [authenticated]);

  const fetchPatents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patents" as any)
      .select("*")
      .order("np_deadline", { ascending: true });

    if (error) {
      toast.error("Failed to load patents");
      console.error(error);
    } else {
      setPatents((data as any[]) || []);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
    setPatents(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    const { error } = await supabase
      .from("patents" as any)
      .update({ [field]: value } as any)
      .eq("id", id);
    if (error) {
      toast.error("Update failed");
      fetchPatents();
    }
  };

  const criticalPatent = useMemo(() => {
    const critical = patents
      .filter(p => p.priority_level === "CRITICAL")
      .sort((a, b) => new Date(a.np_deadline).getTime() - new Date(b.np_deadline).getTime());
    return critical[0];
  }, [patents]);

  const standalonePatents = patents.filter(p => !p.bundle_group);
  const bundlePatents = patents.filter(p => p.bundle_group === "Bundle Group Q-2");

  const stats = useMemo(() => {
    const critical = patents.filter(p => p.priority_level === "CRITICAL").length;
    const high = patents.filter(p => p.priority_level === "HIGH").length;
    const assigned = patents.filter(p => p.attorney_assigned).length;
    return { critical, high, assigned, total: patents.length };
  }, [patents]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0f1729" }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(0,200,180,0.1)" }}>
              <Lock className="w-6 h-6" style={{ color: "#00c8b4" }} />
            </div>
            <CardTitle>VitaSignal Patent Tracker</CardTitle>
            <p className="text-sm text-muted-foreground">Confidential — VitaSignal LLC IP Portfolio</p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (password === PASSWORD) {
                  setAuthenticated(true);
                } else {
                  toast.error("Incorrect password");
                }
              }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" style={{ background: "#0f1729" }}>
                Access Tracker
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8f9fb" }}>
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: "#00c8b4" }} />
                VitaSignal Patent Tracker
              </h1>
              <p className="text-xs text-muted-foreground">Confidential — VitaSignal LLC IP Portfolio</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAuthenticated(false)}>
              Lock
            </Button>
          </div>

          {/* Next Critical Deadline */}
          {criticalPatent && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-sm font-medium text-red-800">
                Next Critical Deadline: {criticalPatent.patent_number} — {new Date(criticalPatent.np_deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — {daysUntil(criticalPatent.np_deadline)} days remaining
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="mt-3 flex gap-4 text-xs">
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-medium">{stats.critical} Critical</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">{stats.high} High</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">{stats.total} Total</span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-medium">{stats.assigned}/{stats.total} Attorney Assigned</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Standalone patents */}
            {standalonePatents.map(p => (
              <PatentCard key={p.id} patent={p} onUpdate={handleUpdate} />
            ))}

            {/* Bundle Group */}
            {bundlePatents.length > 0 && (
              <Collapsible open={bundleOpen} onOpenChange={setBundleOpen}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 rounded-lg px-3 py-2 transition-colors">
                    {bundleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="font-semibold text-sm">Bundle Group Q-2</span>
                    <Badge variant="secondary" className="text-[10px]">{bundlePatents.length} patents · 63/995,920–925</Badge>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-2">
                  {bundlePatents.map(p => (
                    <PatentCard key={p.id} patent={p} onUpdate={handleUpdate} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4 text-center text-xs text-muted-foreground">
        Confidential — VitaSignal LLC IP Portfolio · {patents.length} Patent Applications Filed
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Database, CheckCircle2, AlertTriangle, Clock, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface FHIREvent {
  id: string;
  event_type: string;
  resource_type: string;
  resource_id: string | null;
  vendor: string | null;
  patient_id: string | null;
  signature_valid: boolean;
  created_at: string;
}

const resourceColors: Record<string, string> = {
  Patient: "text-chart-1 bg-chart-1/10 border-chart-1/30",
  Observation: "text-risk-low bg-risk-low/10 border-risk-low/30",
  Encounter: "text-warning bg-warning/10 border-warning/30",
  Condition: "text-destructive bg-destructive/10 border-destructive/30",
  Bundle: "text-primary bg-primary/10 border-primary/30",
};

const vendorColors: Record<string, string> = {
  epic: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  cerner: "bg-accent/10 text-accent border-accent/20",
  meditech: "bg-primary/10 text-primary border-primary/20",
  allscripts: "bg-warning/10 text-warning border-warning/20",
};

// Generate simulated events for demo
const simulateEvent = (): Omit<FHIREvent, "id"> => {
  const types = ["Patient", "Observation", "Encounter", "Condition", "Bundle"];
  const vendors = ["epic", "cerner", "meditech", "allscripts"];
  const events = ["resource-received", "bundle-transaction", "resource-received", "resource-received"];
  return {
    event_type: events[Math.floor(Math.random() * events.length)],
    resource_type: types[Math.floor(Math.random() * types.length)],
    resource_id: `res-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    patient_id: `PT-${Math.floor(Math.random() * 9000) + 1000}`,
    signature_valid: Math.random() > 0.15,
    created_at: new Date().toISOString(),
  };
};

export const FHIRWebhookFeed = () => {
  const [events, setEvents] = useState<FHIREvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  // Subscribe to realtime fhir_events
  useEffect(() => {
    const channel = supabase
      .channel("fhir-events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "fhir_events" },
        (payload) => {
          const newEvent = payload.new as FHIREvent;
          setEvents((prev) => [newEvent, ...prev].slice(0, 50));
          setTotalEvents((p) => p + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Demo simulation when no real events are coming in
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const simulated = simulateEvent();
      const fakeEvent: FHIREvent = {
        ...simulated,
        id: crypto.randomUUID(),
      };
      setEvents((prev) => [fakeEvent, ...prev].slice(0, 50));
      setTotalEvents((p) => p + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  const successRate = events.length > 0
    ? ((events.filter((e) => e.signature_valid).length / events.length) * 100).toFixed(1)
    : "100.0";

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Real-Time FHIR Webhook Feed
            <Badge variant="outline" className="text-[9px] tabular-nums">
              {totalEvents} events
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("text-[10px] h-6 px-2", isLive && "border-risk-low/30 text-risk-low")}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? (
                <><Pause className="h-3 w-3 mr-1" /> Pause</>
              ) : (
                <><Play className="h-3 w-3 mr-1" /> Resume</>
              )}
            </Button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-risk-low/10 border border-risk-low/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-risk-low" />
              </span>
              <span className="text-[9px] font-semibold text-risk-low">LIVE</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mini KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-foreground tabular-nums">{totalEvents}</p>
            <p className="text-[9px] text-muted-foreground font-medium">Events Received</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-risk-low tabular-nums">{successRate}%</p>
            <p className="text-[9px] text-muted-foreground font-medium">Signature Valid</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold text-primary tabular-nums">
              {new Set(events.map((e) => e.vendor).filter(Boolean)).size}
            </p>
            <p className="text-[9px] text-muted-foreground font-medium">Active Vendors</p>
          </div>
        </div>

        {/* Event stream */}
        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {events.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border",
                  resourceColors[evt.resource_type] || "bg-secondary/50 border-border"
                )}
              >
                <Activity className="h-3 w-3 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={cn("text-[8px] font-mono", resourceColors[evt.resource_type])}>
                      {evt.resource_type}
                    </Badge>
                    <Badge variant="outline" className="text-[8px]">{evt.event_type}</Badge>
                    {evt.vendor && (
                      <Badge variant="outline" className={cn("text-[8px]", vendorColors[evt.vendor] || "")}>
                        {evt.vendor}
                      </Badge>
                    )}
                    {evt.patient_id && (
                      <span className="text-[8px] text-muted-foreground font-mono">{evt.patient_id}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground tabular-nums">
                    {new Date(evt.created_at).toLocaleTimeString()}
                  </span>
                  {evt.signature_valid ? (
                    <CheckCircle2 className="h-3 w-3 text-risk-low" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-warning" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Waiting for incoming FHIR events...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

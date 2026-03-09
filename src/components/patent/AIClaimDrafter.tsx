import { useState, useRef } from "react";
import { Brain, Copy, Check, Loader2, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PATENT_SYSTEMS = [
  { id: "icu-mortality", title: "ICU Mortality Prediction (IDI)" },
  { id: "alert-governance", title: "Alert Governance (ChartMinder)" },
  { id: "clinical-risk", title: "Clinical Risk Assessment" },
  { id: "unified-nursing", title: "Unified Nursing Dashboard" },
  { id: "dbs", title: "Documentation Burden Score (DBS)" },
  { id: "traci", title: "Temporal Risk (TRACI)" },
  { id: "esdbi", title: "Staffing Optimization (ESDBI)" },
  { id: "shqs", title: "Quality Surveillance (SHQS)" },
  { id: "dtbl", title: "Digital Twin (DTBL)" },
  { id: "ctci", title: "Clinical Trials (CTCI)" },
  { id: "sedr", title: "Syndromic Response (SEDR)" },
];

const CLAIM_TYPES = [
  { value: "independent and dependent", label: "Mixed (Independent + Dependent)" },
  { value: "independent only", label: "Independent Only" },
  { value: "dependent only", label: "Dependent Only (provide parent claims)" },
  { value: "method", label: "Method Claims Only" },
  { value: "system", label: "System Claims Only" },
];

export const AIClaimDrafter = () => {
  const [systemTitle, setSystemTitle] = useState("");
  const [inventionDescription, setInventionDescription] = useState("");
  const [priorArtContext, setPriorArtContext] = useState("");
  const [claimType, setClaimType] = useState("independent and dependent");
  const [numberOfClaims, setNumberOfClaims] = useState("5");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleDraft = async () => {
    if (!systemTitle.trim() || !inventionDescription.trim()) {
      toast.error("System title and invention description are required");
      return;
    }

    setIsStreaming(true);
    setOutput("");
    abortRef.current = new AbortController();

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/draft-patent-claims`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          systemTitle,
          inventionDescription,
          claimType,
          priorArtContext,
          numberOfClaims: parseInt(numberOfClaims),
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to generate claims");
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setOutput(fullText);
            }
          } catch { /* partial */ }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        toast.error(e.message || "Failed to generate claims");
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Claims copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">AI Claim Drafter</h3>
          <p className="text-xs text-muted-foreground">Generate USPTO-format patent claims from plain-English descriptions</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Patent System</Label>
            <Select value={systemTitle} onValueChange={setSystemTitle}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a system or type custom..." />
              </SelectTrigger>
              <SelectContent>
                {PATENT_SYSTEMS.map((s) => (
                  <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="mt-2"
              placeholder="Or enter custom system title..."
              value={systemTitle}
              onChange={(e) => setSystemTitle(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Invention Description</Label>
            <Textarea
              className="mt-1 min-h-[140px]"
              placeholder="Describe what the invention does, how it works, and what makes it novel. Include technical details about data processing, algorithms, and outputs..."
              value={inventionDescription}
              onChange={(e) => setInventionDescription(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Prior Art / Differentiation (Optional)</Label>
            <Textarea
              className="mt-1 min-h-[80px]"
              placeholder="How does this differ from existing solutions? What prior art should claims navigate around?"
              value={priorArtContext}
              onChange={(e) => setPriorArtContext(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Claim Type</Label>
              <Select value={claimType} onValueChange={setClaimType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLAIM_TYPES.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Number of Claims</Label>
              <Input
                className="mt-1"
                type="number"
                min="1"
                max="25"
                value={numberOfClaims}
                onChange={(e) => setNumberOfClaims(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDraft}
              disabled={isStreaming || !systemTitle.trim() || !inventionDescription.trim()}
              className="flex-1"
            >
              {isStreaming ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Drafting...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Draft Claims</>
              )}
            </Button>
            {isStreaming && (
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Generated Claims
            </Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className={cn(
            "rounded-lg border bg-muted/30 p-4 min-h-[400px] max-h-[600px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap",
            isStreaming && "border-primary/30"
          )}>
            {output || (
              <span className="text-muted-foreground italic">
                Generated claims will appear here...
              </span>
            )}
            {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-blink ml-0.5" />}
          </div>
        </div>
      </div>
    </div>
  );
};

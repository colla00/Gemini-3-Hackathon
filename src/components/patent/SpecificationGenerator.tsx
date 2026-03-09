import { useState } from "react";
import { Brain, Loader2, Copy, Check, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { value: "abstract", label: "Abstract", desc: "≤150 word summary" },
  { value: "background", label: "Background of the Invention", desc: "Prior art + unmet need" },
  { value: "summary", label: "Summary of the Invention", desc: "Problem + solution overview" },
  { value: "detailed", label: "Detailed Description", desc: "Full technical specification" },
];

export const SpecificationGenerator = () => {
  const [systemTitle, setSystemTitle] = useState("");
  const [claimsText, setClaimsText] = useState("");
  const [sectionType, setSectionType] = useState("summary");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!systemTitle.trim() || !claimsText.trim()) {
      toast.error("System title and claims are required");
      return;
    }

    setIsStreaming(true);
    setOutput("");

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-spec-section`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ systemTitle, claimsText, sectionType }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to generate specification");
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setOutput(fullText); }
          } catch { /* partial */ }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Specification Generator</h3>
          <p className="text-xs text-muted-foreground">Auto-generate patent specification sections from your claims</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">System Title</Label>
            <Input className="mt-1" placeholder="e.g., ICU Mortality Prediction System" value={systemTitle} onChange={(e) => setSystemTitle(e.target.value)} />
          </div>

          <div>
            <Label className="text-sm font-medium">Specification Section</Label>
            <Select value={sectionType} onValueChange={setSectionType}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <span>{s.label}</span>
                    <span className="text-muted-foreground text-xs ml-2">— {s.desc}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Claims (for reference)</Label>
            <Textarea
              className="mt-1 min-h-[200px] font-mono text-xs"
              placeholder="Paste your drafted claims here. The AI will use them to generate a consistent specification..."
              value={claimsText}
              onChange={(e) => setClaimsText(e.target.value)}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isStreaming || !systemTitle.trim() || !claimsText.trim()} className="w-full">
            {isStreaming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Section</>}
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">{SECTIONS.find(s => s.value === sectionType)?.label || "Output"}</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className={cn(
            "rounded-lg border bg-muted/30 p-4 min-h-[400px] max-h-[600px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap",
            isStreaming && "border-primary/30"
          )}>
            {output || <span className="text-muted-foreground italic">Generated text will appear here...</span>}
            {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-blink ml-0.5" />}
          </div>
        </div>
      </div>
    </div>
  );
};

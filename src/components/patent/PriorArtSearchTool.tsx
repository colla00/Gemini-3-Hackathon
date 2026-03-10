import { useState } from 'react';
import { Search, Loader2, BookOpen, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PATENT_PORTFOLIO } from '@/constants/patent';
import { cn } from '@/lib/utils';

interface PriorArtResult {
  title: string;
  relevance: 'high' | 'medium' | 'low';
  type: string;
  summary: string;
  differentiators: string[];
}

export const PriorArtSearchTool = () => {
  const [selectedPatent, setSelectedPatent] = useState(PATENT_PORTFOLIO[0].id);
  const [claimText, setClaimText] = useState('');
  const [results, setResults] = useState<PriorArtResult[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!claimText.trim()) {
      toast({ title: 'Enter claim language', description: 'Paste or type your claim text to analyze.', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    setResults([]);
    setAnalysis('');

    try {
      const patent = PATENT_PORTFOLIO.find(p => p.id === selectedPatent);
      const response = await supabase.functions.invoke('prior-art-search', {
        body: {
          claimText,
          patentTitle: patent?.title || '',
          patentShortName: patent?.shortName || '',
        },
      });

      if (response.error) throw response.error;

      const data = response.data;
      if (data?.results) setResults(data.results);
      if (data?.analysis) setAnalysis(data.analysis);
    } catch (error: any) {
      console.error('Prior art search error:', error);
      toast({ title: 'Search failed', description: error.message || 'Failed to analyze prior art.', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const relevanceColor = {
    high: 'text-destructive border-destructive/30 bg-destructive/10',
    medium: 'text-amber-600 border-amber-500/30 bg-amber-500/10',
    low: 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Patent Application</Label>
          <Select value={selectedPatent} onValueChange={setSelectedPatent}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PATENT_PORTFOLIO.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.shortName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Claim Language to Analyze</Label>
        <Textarea
          value={claimText}
          onChange={e => setClaimText(e.target.value)}
          placeholder="Paste your independent claim or key claim language here. The AI will analyze it against known prior art patterns in clinical decision support, EHR analytics, and nursing informatics..."
          className="min-h-[120px] text-sm"
        />
      </div>

      <Button onClick={handleSearch} disabled={isSearching || !claimText.trim()}>
        {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
        {isSearching ? 'Analyzing Prior Art...' : 'Search Prior Art'}
      </Button>

      {/* Analysis summary */}
      {analysis && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">{results.length} potential prior art references identified</p>
          {results.map((result, idx) => (
            <Card key={idx}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{result.title}</span>
                      <Badge variant="outline" className="text-[10px]">{result.type}</Badge>
                    </div>
                  </div>
                  <Badge className={cn('text-[10px] shrink-0', relevanceColor[result.relevance])}>
                    {result.relevance === 'high' ? 'High Overlap' : result.relevance === 'medium' ? 'Moderate' : 'Low Risk'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{result.summary}</p>
                {result.differentiators.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-primary">Key Differentiators:</p>
                    <ul className="space-y-0.5">
                      {result.differentiators.map((d, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

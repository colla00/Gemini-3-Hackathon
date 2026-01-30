import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClinicalNotesAnalyzer, 
  HealthEquityAnalyzer 
} from '@/components/ai';
import { 
  Sparkles, 
  Stethoscope, 
  Scale,
  Brain,
  FileText,
  ExternalLink
} from 'lucide-react';

export const AIToolsPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  AI-Powered Clinical Tools
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Gemini 3
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Google Gemini 3 integration for clinical decision support
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Brain className="h-3 w-3" />
                Gemini 3 Flash + Pro
              </Badge>
              <Badge variant="outline" className="gap-1">
                <FileText className="h-3 w-3" />
                Hackathon 2026
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Tools Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="mb-4 bg-card/60 border border-border/40 flex-wrap h-auto gap-1.5 p-1.5 rounded-2xl">
          <TabsTrigger 
            value="notes" 
            className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Stethoscope className="h-4 w-4" />
            Clinical Notes
          </TabsTrigger>
          <TabsTrigger 
            value="equity" 
            className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Scale className="h-4 w-4" />
            Health Equity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-0">
          <div className="grid gap-6">
            <ClinicalNotesAnalyzer />
            
            {/* Usage Guide */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">How to Use Clinical Notes Analyzer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. Enter nurse observations, vital sign changes, or patient symptoms
                </p>
                <p>
                  2. AI extracts warning signs and assesses deterioration risk
                </p>
                <p>
                  3. Review prioritized monitoring recommendations
                </p>
                <p className="text-xs italic mt-4">
                  ✨ Powered by Google Gemini 3 Flash - Fast, accurate clinical text analysis
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equity" className="mt-0">
          <div className="grid gap-6">
            <HealthEquityAnalyzer />
            
            {/* AIM-AHEAD Context */}
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  AIM-AHEAD Fellowship Initiative
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  This health equity analysis tool supports the AIM-AHEAD initiative 
                  to ensure AI-powered clinical tools promote health equity rather 
                  than perpetuate disparities.
                </p>
                <p className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <a 
                    href="https://aim-ahead.net/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Learn more about AIM-AHEAD
                  </a>
                </p>
                <p className="text-xs italic mt-4">
                  ✨ Powered by Google Gemini 3 Pro - Advanced reasoning for equity analysis
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-amber-50/50 border-amber-200">
        <CardContent className="py-3">
          <p className="text-xs text-amber-800">
            <strong>Clinical Decision Support Disclaimer:</strong> AI-generated 
            suggestions are for informational purposes only and do not constitute 
            medical advice. All clinical decisions must be made by qualified 
            healthcare professionals. This tool is part of an investigational 
            research study.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

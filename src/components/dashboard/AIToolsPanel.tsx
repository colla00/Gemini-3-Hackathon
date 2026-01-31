import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClinicalNotesAnalyzer, 
  HealthEquityAnalyzer,
  GeminiAIEngine
} from '@/components/ai';
import { 
  Sparkles, 
  Stethoscope, 
  Scale,
  Brain,
  FileText,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const AIToolsPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* External AI Tools Link */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="py-4">
          <a 
            href="https://www.dralexis.ceo/ai-tools" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between group hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Dr. Alexis AI Tools Platform
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore the full suite of AI-powered clinical decision support tools
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
              <Sparkles className="h-3 w-3 mr-1" />
              Visit
            </Badge>
          </a>
        </CardContent>
      </Card>

      {/* AI Tools Tabs */}
      <Tabs defaultValue="engine" className="w-full">
        <TabsList className="mb-4 bg-card/60 border border-border/40 flex-wrap h-auto gap-1.5 p-1.5 rounded-2xl">
          <TabsTrigger 
            value="engine" 
            className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
          >
            <Cpu className="h-4 w-4" />
            AI Engine Demo
          </TabsTrigger>
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

        {/* Gemini 3 AI Engine - Main Showcase */}
        <TabsContent value="engine" className="mt-0">
          <GeminiAIEngine />
        </TabsContent>

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
            
            {/* Health Equity Context */}
            <Card className="bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Health Equity Initiative
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  This health equity analysis tool ensures AI-powered clinical tools promote health equity rather 
                  than perpetuate disparities.
                </p>
                <p className="text-xs italic mt-4">
                  ✨ Powered by Google Gemini 3 Pro - Advanced reasoning for equity analysis
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

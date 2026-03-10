import { SiteLayout } from "@/components/layout/SiteLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, ImageIcon, Gavel } from "lucide-react";
import { AIClaimDrafter } from "@/components/patent/AIClaimDrafter";
import { SpecificationGenerator } from "@/components/patent/SpecificationGenerator";
import { PatentFigureManager } from "@/components/patent/PatentFigureManager";
import { OfficeActionTracker } from "@/components/patent/OfficeActionTracker";

export default function PatentWorkbench() {
  return (
    <SiteLayout
      title="Patent Workbench — AI-Powered Drafting Tools"
      description="AI claim drafter, specification generator, and office action tracker for VitaSignal's patent portfolio."
    >
      <section className="relative py-16 px-6 bg-foreground text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Patent Tools</p>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Patent Workbench</h1>
          <p className="text-primary-foreground/60 max-w-xl">
            AI-powered tools for drafting claims, generating specifications, and managing the nonprovisional conversion process.
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="claims" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="claims" className="flex items-center gap-2">
                <Brain className="w-4 h-4" /> Claims
              </TabsTrigger>
              <TabsTrigger value="spec" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Spec Gen
              </TabsTrigger>
              <TabsTrigger value="figures" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Figures
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Gavel className="w-4 h-4" /> Office Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="claims">
              <AIClaimDrafter />
            </TabsContent>

            <TabsContent value="spec">
              <SpecificationGenerator />
            </TabsContent>

            <TabsContent value="figures">
              <PatentFigureManager />
            </TabsContent>

            <TabsContent value="actions">
              <OfficeActionTracker />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
}

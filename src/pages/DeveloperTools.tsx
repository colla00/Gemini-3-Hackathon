import { SiteLayout } from "@/components/layout/SiteLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Send } from "lucide-react";
import { SDKCodeGenerator } from "@/components/integration/SDKCodeGenerator";
import { WebhookTestConsole } from "@/components/integration/WebhookTestConsole";

export default function DeveloperTools() {
  return (
    <SiteLayout
      title="Developer Tools — Integration SDK & Webhook Testing"
      description="Interactive API playground, SDK code generator, and webhook testing console for VitaSignal EHR integration."
    >
      <section className="relative py-16 px-6 bg-foreground text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Developer Tools</p>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Integration Toolkit</h1>
          <p className="text-primary-foreground/60 max-w-xl">
            SDK code generators, webhook testing, and debugging tools for technical integration teams.
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="sdk" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sdk" className="flex items-center gap-2">
                <Code2 className="w-4 h-4" /> SDK Code Generator
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Send className="w-4 h-4" /> Webhook Testing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sdk">
              <SDKCodeGenerator />
            </TabsContent>

            <TabsContent value="webhook">
              <WebhookTestConsole />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
}

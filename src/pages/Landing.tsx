import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Landing = () => {
  return (
    <SiteLayout
      title="Equipment-Independent Clinical AI"
      description="Patent-protected AI for ICU mortality prediction using temporal documentation pattern analysis. Zero hardware cost. Available for licensing."
    >
      {/* Hero */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 gap-1 text-xs">
            <Shield className="w-3 h-3" />
            5 U.S. Patents Filed
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Detecting Life-Saving Signals Before Crisis
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Equipment-independent AI for ICU mortality prediction using temporal documentation pattern analysis. Zero hardware cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/patents">Technology Portfolio</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:info@alexiscollier.com">
                <Mail className="w-4 h-4 mr-2" />
                Licensing Inquiries
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Validated Performance */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-risk-low/30 bg-risk-low/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className="bg-risk-low text-white text-xs">VALIDATED PERFORMANCE</Badge>
                <Badge variant="outline" className="text-xs">Patent #1</Badge>
              </div>
              <CardTitle className="text-xl mt-2">ICU Mortality Prediction (IDI Framework)</CardTitle>
              <CardDescription>
                9 automatically extractable features from routine EHR nursing documentation timestamps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "AUC", value: "0.684", sub: "95% CI: 0.653–0.715" },
                  { label: "Dataset", value: "26,153", sub: "ICU stays" },
                  { label: "Validation", value: "11 years", sub: "Temporal split" },
                  { label: "Top Predictor", value: "OR 1.82", sub: "Documentation rhythm" },
                ].map((m) => (
                  <div key={m.label} className="bg-card p-3 rounded-lg border border-risk-low/20">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-xl font-bold text-risk-low">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                4 additional patent-pending systems in design phase. Details available under NDA.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Licensing & Partnerships</h2>
          <p className="text-primary-foreground/80 mb-8">
            Available for licensing to EHR vendors, hospital systems, and healthcare AI companies.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <a href="mailto:info@alexiscollier.com">
              <Mail className="w-5 h-5 mr-2" />
              Contact for Licensing
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

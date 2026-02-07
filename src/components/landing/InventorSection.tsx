import { GraduationCap, Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const credentials = [
  {
    icon: GraduationCap,
    title: "Doctor of Health Administration",
    detail: "Clinical informatics & healthcare AI research",
  },
  {
    icon: Award,
    title: "Stanford AI+Health 2025",
    detail: "Invited presentation on equipment-independent clinical AI",
  },
  {
    icon: BookOpen,
    title: "NIH-Funded Research",
    detail: "Federal grant support for clinical AI validation studies",
  },
];

export const InventorSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Inventor
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Dr. Alexis M. Collier, DHA
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            A clinical informaticist and healthcare AI researcher focused on
            extracting predictive intelligence from existing electronic health
            record infrastructure — eliminating the need for additional
            monitoring hardware in resource-constrained settings.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dr. Collier's research demonstrates that routine nursing documentation
            timestamps contain clinically actionable signals for mortality
            prediction, challenging the assumption that predictive analytics
            requires expensive physiological monitoring equipment.
          </p>
        </div>

        {/* Credentials */}
        <div className="space-y-4">
          {credentials.map((c) => (
            <Card key={c.title}>
              <CardContent className="flex items-start gap-4 py-5 px-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);

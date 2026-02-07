import { GraduationCap, Award, BookOpen, Linkedin } from "lucide-react";
import alexisPhoto from "@/assets/alexis-collier.png";

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
    detail: "CLINAQ Fellowship & AIM-AHEAD consortium grants",
  },
];

export const InventorSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-5 gap-12 items-center">
        {/* Photo + name */}
        <div className="md:col-span-2 text-center md:text-left">
          <div className="relative inline-block mb-6">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
              <img
                src={alexisPhoto}
                alt="Dr. Alexis M. Collier, DHA"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Accent corner */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h3 className="font-display text-2xl text-foreground mb-1">
            Dr. Alexis M. Collier
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            DHA | Inventor & Principal Investigator
          </p>
          <a
            href="https://www.linkedin.com/in/alexiscollier/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn Profile
          </a>
        </div>

        {/* Bio + credentials */}
        <div className="md:col-span-3">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Inventor
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            A clinical informaticist and healthcare AI researcher focused on
            extracting predictive intelligence from existing electronic health
            record infrastructure - eliminating the need for additional
            monitoring hardware in resource-constrained settings.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Dr. Collier's research demonstrates that routine nursing documentation
            timestamps contain clinically actionable signals for mortality
            prediction, challenging the assumption that predictive analytics
            requires expensive physiological monitoring equipment.
          </p>

          <div className="space-y-3">
            {credentials.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{c.title}</h4>
                  <p className="text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

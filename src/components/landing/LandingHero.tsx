import { ArrowRight, Shield, Mail, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoAccessModal } from "@/components/WalkthroughRequestModal";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "0.684", label: "AUC", detail: "Predictive Performance" },
  { value: "26,153", label: "ICU Admissions", detail: "Validation Cohort" },
  { value: "5", label: "Patents Filed", detail: "175+ Claims" },
  { value: "11yr", label: "Temporal Span", detail: "2008-2019" },
];

export const LandingHero = () => (
  <section className="relative overflow-hidden bg-foreground text-primary-foreground">
    {/* Background image with overlay */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      {/* Stanford credential */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/20 border border-primary/30 text-sm animate-fade-in">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
        <span className="text-primary font-medium">Presented at Stanford AI+Health 2025</span>
      </div>

      {/* Main headline */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.05] max-w-4xl animate-fade-in">
        Clinical Intelligence
        <br />
        <span className="text-primary">Without Equipment</span>
      </h1>

      <p className="text-lg md:text-xl max-w-2xl mb-8 opacity-80 leading-relaxed animate-fade-in">
        Patent-protected AI that predicts ICU mortality from documentation
        patterns alone. No sensors. No wearables. No added cost.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-16 animate-fade-in">
        <Button size="lg" className="text-base px-8 h-12 shadow-lg" asChild>
          <Link to="/licensing" className="gap-2">
            Explore Licensing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <DemoAccessModal
          trigger={
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 h-12 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10"
            >
              <Presentation className="w-4 h-4 mr-2" />
              Request Demo Access
            </Button>
          }
        />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/10 rounded-xl overflow-hidden animate-fade-in">
        {stats.map((s) => (
          <div key={s.label} className="bg-foreground/80 backdrop-blur-sm p-5 text-center">
            <p className="font-display text-2xl md:text-3xl text-primary mb-1">{s.value}</p>
            <p className="text-sm font-semibold opacity-90">{s.label}</p>
            <p className="text-xs opacity-50 mt-0.5">{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

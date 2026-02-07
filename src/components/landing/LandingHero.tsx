import { ArrowRight, Award, Shield, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const LandingHero = () => (
  <section className="relative overflow-hidden">
    {/* Subtle background texture */}
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.12) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.08) 0%, transparent 50%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>

    <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36">
      <div className="flex flex-col items-center text-center">
        {/* Stanford credential badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-card border border-border/60 shadow-sm animate-fade-in">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Presented at Stanford AI+Health 2025
          </span>
        </div>

        {/* Main headline - serif for authority */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.1] animate-fade-in">
          Clinical Intelligence{" "}
          <span className="text-primary">Without Equipment</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4 animate-fade-in">
          Patent-protected AI that predicts ICU mortality from documentation patterns alone.
          No sensors. No wearables. No added cost.
        </p>

        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <Badge variant="outline" className="gap-1.5 py-1">
            <Shield className="w-3 h-3" />
            5 U.S. Patents Filed
          </Badge>
          <Badge variant="outline" className="py-1">
            175+ Claims
          </Badge>
          <Badge variant="outline" className="py-1">
            NIH-Funded Research
          </Badge>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
          <Button size="lg" className="text-base px-8 h-12 shadow-lg" asChild>
            <Link to="/licensing" className="gap-2">
              Explore Licensing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 h-12" asChild>
            <a href="mailto:info@alexiscollier.com" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

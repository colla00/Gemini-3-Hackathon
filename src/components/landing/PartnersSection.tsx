import { Building2, Briefcase, Users, Microscope, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const partners = [
  {
    icon: Building2,
    title: "EHR Vendors",
    desc: "Integrate equipment-independent AI into existing health record platforms",
  },
  {
    icon: Briefcase,
    title: "Healthcare AI Companies",
    desc: "Add patent-pending clinical prediction to your product suite",
  },
  {
    icon: Microscope,
    title: "Academic Medical Centers",
    desc: "Collaborate on clinical validation and joint research publications",
  },
  {
    icon: Users,
    title: "Strategic Investors",
    desc: "Partner in commercializing a novel approach to clinical intelligence",
  },
];

export const PartnersSection = () => (
  <section className="py-24 px-6 bg-secondary/50">
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: messaging */}
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Licensing Opportunities
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Built for Integration
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            VitaSignal™'s patent-pending technology is designed to embed into
            existing clinical workflows. We're seeking strategic partners to
            bring equipment-independent AI to healthcare at scale.
          </p>
          <Link
            to="/licensing"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View licensing options
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: partner types */}
        <div className="grid grid-cols-2 gap-3">
          {partners.map((p) => (
            <div
              key={p.title}
              className="group p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

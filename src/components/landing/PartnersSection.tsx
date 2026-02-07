import { Building2, Briefcase, Users, Microscope } from "lucide-react";

const partners = [
  {
    icon: Building2,
    title: "EHR Vendors",
    desc: "Integrate equipment-independent AI into existing health record platforms",
  },
  {
    icon: Briefcase,
    title: "Healthcare AI Companies",
    desc: "Add patent-protected clinical prediction to your product suite",
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
  <section className="py-20 px-6 bg-secondary/40">
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        Who We Work With
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-12">
        Ideal Licensing Partners
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners.map((p) => (
          <div
            key={p.title}
            className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all text-left"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <p.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 text-sm">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

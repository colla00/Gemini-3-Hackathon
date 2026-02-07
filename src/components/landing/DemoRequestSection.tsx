import { Monitor, ShieldCheck, Clock } from "lucide-react";
import { WalkthroughRequestModal } from "@/components/WalkthroughRequestModal";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Monitor, text: "Full clinical dashboard walkthrough" },
  { icon: ShieldCheck, text: "Patent-protected AI in action" },
  { icon: Clock, text: "45-minute guided experience" },
];

export const DemoRequestSection = () => (
  <section className="py-20 px-6 bg-foreground text-primary-foreground">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        See It In Action
      </p>
      <h2 className="font-display text-2xl md:text-4xl text-primary-foreground mb-4">
        Request a Live Demo
      </h2>
      <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
        Experience VitaSignal's clinical intelligence platform firsthand.
        Submit a request and we'll set up a personalized walkthrough
        of the full dashboard and AI capabilities.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {benefits.map((b) => (
          <div key={b.text} className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <b.icon className="w-4 h-4 text-primary" />
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      <WalkthroughRequestModal
        trigger={
          <Button size="lg" className="text-base px-10 h-12 shadow-lg">
            Request Demo Access
          </Button>
        }
      />
    </div>
  </section>
);

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Phase {
  phase: string;
  title: string;
  duration: string;
  icon: React.ElementType;
  steps: string[];
}

export const ImplementationTimeline = ({ phases }: { phases: Phase[] }) => {
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  return (
    <div className="space-y-4">
      {phases.map((phase, i) => {
        const isExpanded = expandedPhase === i;
        return (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "rounded-xl border transition-all cursor-pointer",
              isExpanded
                ? "border-primary/40 bg-primary/5 shadow-sm"
                : "border-border/40 bg-card hover:border-primary/20"
            )}
            onClick={() => setExpandedPhase(i)}
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5">
              {/* Phase number circle */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors",
                isExpanded
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground text-sm md:text-base">{phase.title}</h3>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {phase.phase}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{phase.duration}</span>
                </div>
              </div>

              <phase.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isExpanded ? "text-primary" : "text-muted-foreground"
              )} />
            </div>

            {/* Expanded steps */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="px-5 pb-5"
              >
                <div className="pl-14 space-y-2.5 border-l-2 border-primary/20 ml-5">
                  {phase.steps.map((step, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.06 }}
                      className="flex items-start gap-2.5 -ml-[9px]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-relaxed">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

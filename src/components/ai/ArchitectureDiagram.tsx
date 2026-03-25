import { motion } from 'framer-motion';

const layers = [
  {
    label: 'Frontend',
    color: 'hsl(var(--primary))',
    items: ['React + TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
  },
  {
    label: 'AI Gateway',
    color: 'hsl(var(--primary))',
    items: ['Gemini 3 Flash (triage)', 'Gemini 3 Pro (reasoning)', 'SSE streaming', 'Prompt routing'],
  },
  {
    label: 'Backend',
    color: 'hsl(var(--primary))',
    items: ['8 Edge Functions', 'PostgreSQL + RLS', 'FHIR R4 API', 'Audit logging'],
  },
  {
    label: 'Compliance',
    color: 'hsl(var(--primary))',
    items: ['HIPAA-ready', 'No PHI in client', 'E2E encryption', '11 USPTO filings'],
  },
];

export const ArchitectureDiagram = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-5 text-center">
        System Architecture
      </h3>
      <div className="space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative"
          >
            <div className="flex items-stretch gap-3">
              <div className="w-24 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 px-2 py-2">
                <span className="text-[11px] font-bold text-primary text-center leading-tight">
                  {layer.label}
                </span>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {layer.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-md bg-muted/50 border border-border/50 px-2.5 py-1.5 text-[10px] text-muted-foreground text-center font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-px h-3 bg-border" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-4">
        All AI inference routed server-side · No API keys in client code · Synthetic data only
      </p>
    </div>
  );
};

import { Award, TrendingUp, Users, Clock, Sparkles, ArrowRight, HeartPulse } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PATENT_PORTFOLIO } from '@/constants/patent';

const icuPatent = PATENT_PORTFOLIO.find(p => p.id === 'icu-mortality')!;

const phenotypes = [
  { name: 'Steady Surveillance', mortality: '3.2%', color: 'bg-risk-low/20 text-risk-low' },
  { name: 'Minimal Documentation', mortality: '8.7%', color: 'bg-risk-medium/20 text-risk-medium' },
  { name: 'Escalating Crisis', mortality: '15.3%', color: 'bg-warning/20 text-warning' },
  { name: 'Chaotic Instability', mortality: '24.1%', color: 'bg-risk-high/20 text-risk-high' },
];

export const FeaturedPatentCard = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 shadow-sm">
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">Patent #1 — Validated Research</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-risk-low/10 border border-risk-low/30">
          <Sparkles className="w-3.5 h-3.5 text-risk-low" />
          <span className="text-xs font-bold text-risk-low">AUC 0.684</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">
        ICU Mortality Prediction
      </h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl">
        Equipment-independent AI using EHR timestamp metadata as a "human sensor" to identify clinical phenotypes with significant mortality stratification.
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border/30">
          <TrendingUp className="w-4 h-4 text-primary shrink-0" />
          <div>
            <span className="text-sm font-bold text-foreground">0.684</span>
            <span className="text-[10px] text-muted-foreground block">AUC Score</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border/30">
          <Users className="w-4 h-4 text-accent shrink-0" />
          <div>
            <span className="text-sm font-bold text-foreground">26,153</span>
            <span className="text-[10px] text-muted-foreground block">ICU Admissions</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border/30">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <div>
            <span className="text-sm font-bold text-foreground">15</span>
            <span className="text-[10px] text-muted-foreground block">Temporal Features</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border/30">
          <Award className="w-4 h-4 text-accent shrink-0" />
          <div>
            <span className="text-sm font-bold text-foreground">4</span>
            <span className="text-[10px] text-muted-foreground block">Phenotypes</span>
          </div>
        </div>
      </div>

      {/* Phenotypes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {phenotypes.map((p) => (
          <div key={p.name} className={`flex items-center justify-between px-3 py-2 rounded-lg ${p.color.split(' ')[0]} border border-border/20`}>
            <span className="text-[11px] font-medium text-foreground">{p.name}</span>
            <span className={`text-xs font-bold ${p.color.split(' ')[1]}`}>{p.mortality}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard?tab=icu-mortality"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <HeartPulse className="w-4 h-4" />
          Explore ICU Mortality
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/patents"
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
        >
          Patent Portfolio
        </Link>
        <span className="text-[11px] text-muted-foreground hidden md:inline">
          {icuPatent.number !== 'Pending' ? `#${icuPatent.number}` : 'Filed'} · {icuPatent.filingDate}
        </span>
      </div>
    </div>
  );
};

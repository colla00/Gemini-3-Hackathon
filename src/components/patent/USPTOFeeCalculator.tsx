import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, FileText, AlertTriangle } from "lucide-react";

// USPTO Fee Schedule (FY 2025 - approximate, updated periodically)
const FEE_SCHEDULE = {
  micro: {
    filing: 80,
    search: 170,
    examination: 200,
    excess_claim_per: 25, // per claim over 20
    excess_independent_per: 60, // per independent claim over 3
    multiple_dependent: 195,
    provisional_to_np: 0, // no conversion fee
  },
  small: {
    filing: 160,
    search: 340,
    examination: 400,
    excess_claim_per: 50,
    excess_independent_per: 120,
    multiple_dependent: 390,
    provisional_to_np: 0,
  },
  large: {
    filing: 320,
    search: 680,
    examination: 800,
    excess_claim_per: 100,
    excess_independent_per: 240,
    multiple_dependent: 780,
    provisional_to_np: 0,
  },
};

type EntityType = "micro" | "small" | "large";

// VitaSignal patent systems for the calculator
const PATENT_SYSTEMS = [
  { id: "idi", name: "ICU Mortality (IDI)", defaultClaims: 20, defaultIndependent: 3 },
  { id: "chartminder", name: "ChartMinder™ Alert", defaultClaims: 15, defaultIndependent: 3 },
  { id: "clinical-risk", name: "Clinical Risk", defaultClaims: 18, defaultIndependent: 3 },
  { id: "unified-nursing", name: "Unified Nursing", defaultClaims: 16, defaultIndependent: 2 },
  { id: "dbs", name: "Documentation Burden", defaultClaims: 15, defaultIndependent: 2 },
  { id: "traci", name: "TRACI (Temporal Risk)", defaultClaims: 14, defaultIndependent: 2 },
  { id: "esdbi", name: "ESDBI (Staffing)", defaultClaims: 12, defaultIndependent: 2 },
  { id: "shqs", name: "SHQS (Quality)", defaultClaims: 13, defaultIndependent: 2 },
  { id: "dtbl", name: "DTBL (Digital Twin)", defaultClaims: 15, defaultIndependent: 3 },
  { id: "ctci", name: "CTCI (Clinical Trials)", defaultClaims: 12, defaultIndependent: 2 },
  { id: "sedr", name: "SEDR (Syndromic)", defaultClaims: 14, defaultIndependent: 2 },
];

interface PatentFee {
  system: string;
  totalClaims: number;
  independentClaims: number;
  filing: number;
  search: number;
  examination: number;
  excessClaims: number;
  excessIndependent: number;
  total: number;
}

export function USPTOFeeCalculator() {
  const [entityType, setEntityType] = useState<EntityType>("micro");
  const [hasMultipleDependent, setHasMultipleDependent] = useState(false);
  const [claimsOverride, setClaimsOverride] = useState<Record<string, { total: number; independent: number }>>({});

  const fees = useMemo(() => {
    const schedule = FEE_SCHEDULE[entityType];
    
    return PATENT_SYSTEMS.map((system): PatentFee => {
      const override = claimsOverride[system.id];
      const totalClaims = override?.total ?? system.defaultClaims;
      const independentClaims = override?.independent ?? system.defaultIndependent;

      const excessClaims = Math.max(0, totalClaims - 20) * schedule.excess_claim_per;
      const excessIndependent = Math.max(0, independentClaims - 3) * schedule.excess_independent_per;

      const total = schedule.filing + schedule.search + schedule.examination + excessClaims + excessIndependent +
        (hasMultipleDependent ? schedule.multiple_dependent : 0);

      return {
        system: system.name,
        totalClaims,
        independentClaims,
        filing: schedule.filing,
        search: schedule.search,
        examination: schedule.examination,
        excessClaims,
        excessIndependent,
        total,
      };
    });
  }, [entityType, hasMultipleDependent, claimsOverride]);

  const grandTotal = fees.reduce((sum, f) => sum + f.total, 0);
  const totalClaims = fees.reduce((sum, f) => sum + f.totalClaims, 0);
  const baseFeePerPatent = FEE_SCHEDULE[entityType].filing + FEE_SCHEDULE[entityType].search + FEE_SCHEDULE[entityType].examination;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">USPTO Fee Calculator</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-sm">
            FY 2025 Schedule
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm">Entity Type</Label>
            <Select value={entityType} onValueChange={v => setEntityType(v as EntityType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="micro">Micro Entity (75% discount)</SelectItem>
                <SelectItem value="small">Small Entity (50% discount)</SelectItem>
                <SelectItem value="large">Large Entity (full fee)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
              <input
                type="checkbox"
                checked={hasMultipleDependent}
                onChange={e => setHasMultipleDependent(e.target.checked)}
                className="rounded"
              />
              <Label className="text-xs">Multiple Dependent Claims</Label>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Base fee per application</p>
            <p className="text-lg font-bold text-primary">${baseFeePerPatent.toLocaleString()}</p>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Patent System</th>
                <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Claims</th>
                <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Indep.</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Filing</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Search</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Exam</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Excess</th>
                <th className="text-right py-2 px-2 text-xs font-bold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2 px-2 font-medium text-xs">{f.system}</td>
                  <td className="py-2 px-2 text-center">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      className="w-14 h-7 text-center text-xs p-0"
                      value={claimsOverride[PATENT_SYSTEMS[i].id]?.total ?? f.totalClaims}
                      onChange={e => {
                        const val = parseInt(e.target.value) || PATENT_SYSTEMS[i].defaultClaims;
                        setClaimsOverride(prev => ({
                          ...prev,
                          [PATENT_SYSTEMS[i].id]: { ...prev[PATENT_SYSTEMS[i].id], total: val, independent: prev[PATENT_SYSTEMS[i].id]?.independent ?? PATENT_SYSTEMS[i].defaultIndependent },
                        }));
                      }}
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      className="w-14 h-7 text-center text-xs p-0"
                      value={claimsOverride[PATENT_SYSTEMS[i].id]?.independent ?? f.independentClaims}
                      onChange={e => {
                        const val = parseInt(e.target.value) || PATENT_SYSTEMS[i].defaultIndependent;
                        setClaimsOverride(prev => ({
                          ...prev,
                          [PATENT_SYSTEMS[i].id]: { total: prev[PATENT_SYSTEMS[i].id]?.total ?? PATENT_SYSTEMS[i].defaultClaims, independent: val },
                        }));
                      }}
                    />
                  </td>
                  <td className="py-2 px-2 text-right text-xs text-muted-foreground">${f.filing}</td>
                  <td className="py-2 px-2 text-right text-xs text-muted-foreground">${f.search}</td>
                  <td className="py-2 px-2 text-right text-xs text-muted-foreground">${f.examination}</td>
                  <td className="py-2 px-2 text-right text-xs text-muted-foreground">
                    {(f.excessClaims + f.excessIndependent) > 0 ? `$${(f.excessClaims + f.excessIndependent).toLocaleString()}` : "—"}
                  </td>
                  <td className="py-2 px-2 text-right font-bold text-xs">${f.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground/20">
                <td className="py-3 px-2 font-bold">TOTAL (11 Applications)</td>
                <td className="py-3 px-2 text-center font-bold">{totalClaims}</td>
                <td colSpan={5}></td>
                <td className="py-3 px-2 text-right font-bold text-lg text-primary">${grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Disclaimers */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-medium">Fee Estimate Disclaimer</p>
            <p>Fees are based on the FY 2025 USPTO fee schedule and are subject to change. Does not include attorney fees, translation costs, or maintenance fees. Verify current fees at <strong>uspto.gov/learning-and-resources/fees-and-payment</strong> before filing.</p>
            <p>Micro entity status requires meeting all criteria under 37 CFR 1.29.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

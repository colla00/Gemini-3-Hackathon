import { useState } from 'react';
import { FlaskConical, User, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const patients = [
  {
    id: 'PT-4821', name: 'R. Martinez', age: 67, unit: 'ICU-A', los: 5,
    matchedTrials: [
      { id: 'NCT-058', title: 'Sepsis Early Intervention', match: 92, criteria: 5, met: 5 },
      { id: 'NCT-061', title: 'Doc Burden Reduction', match: 78, criteria: 5, met: 4 },
    ],
  },
  {
    id: 'PT-3199', name: 'J. Thompson', age: 74, unit: 'ICU-B', los: 12,
    matchedTrials: [
      { id: 'NCT-056', title: 'HAI Predictive Analytics', match: 85, criteria: 5, met: 4 },
    ],
  },
  {
    id: 'PT-5502', name: 'M. Chen', age: 55, unit: 'Med-Surg', los: 3,
    matchedTrials: [
      { id: 'NCT-061', title: 'Doc Burden Reduction', match: 95, criteria: 5, met: 5 },
      { id: 'NCT-058', title: 'Sepsis Early Intervention', match: 41, criteria: 5, met: 2 },
      { id: 'NCT-072', title: 'Remote Monitoring Post-Discharge', match: 88, criteria: 4, met: 4 },
    ],
  },
  {
    id: 'PT-2847', name: 'A. Williams', age: 81, unit: 'Tele', los: 7,
    matchedTrials: [
      { id: 'NCT-056', title: 'HAI Predictive Analytics', match: 62, criteria: 5, met: 3 },
    ],
  },
  {
    id: 'PT-6103', name: 'S. Patel', age: 42, unit: 'Med-Surg', los: 2,
    matchedTrials: [],
  },
];

export const CTCIPatientMatcher = () => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patients[2]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-warning/30 bg-gradient-to-br from-warning/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10 border border-warning/20">
                <User className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-lg">Patient-to-Trial Matcher</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Select a patient to see all matching clinical trials with eligibility scores</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #10</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-warning" />
              Patient Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm"
            />
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedPatient.id === p.id ? 'border-warning/40 bg-warning/5' : 'border-border/20 hover:border-warning/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{p.name}</span>
                    <Badge variant="outline" className={cn(
                      'text-[9px]',
                      p.matchedTrials.length > 0 ? 'text-risk-low border-risk-low/30' : 'text-muted-foreground'
                    )}>
                      {p.matchedTrials.length} matches
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{p.id} · Age {p.age} · {p.unit} · Day {p.los}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trial Matches */}
        <Card className="lg:col-span-2 border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-warning" />
                Trial Matches for {selectedPatient.name}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {selectedPatient.matchedTrials.length} trial{selectedPatient.matchedTrials.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedPatient.matchedTrials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <XCircle className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No matching trials for this patient</p>
                <p className="text-[10px] mt-1">Documentation patterns don't match current trial eligibility criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPatient.matchedTrials.map(t => (
                  <div key={t.id} className={cn(
                    'p-4 rounded-xl border',
                    t.match >= 80 ? 'border-risk-low/30 bg-risk-low/5' :
                    t.match >= 60 ? 'border-warning/30 bg-warning/5' :
                    'border-border/30 bg-muted/20'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground">{t.id}</span>
                        <p className="text-sm font-bold text-foreground">{t.title}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'text-2xl font-bold',
                          t.match >= 80 ? 'text-risk-low' : t.match >= 60 ? 'text-warning' : 'text-muted-foreground'
                        )}>{t.match}%</p>
                        <p className="text-[9px] text-muted-foreground">match score</p>
                      </div>
                    </div>
                    <Progress value={t.match} className="h-2 mb-2" />
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-risk-low" />
                      {t.met}/{t.criteria} criteria met
                      {t.met < t.criteria && (
                        <span className="ml-auto flex items-center gap-1 text-warning">
                          <XCircle className="h-3 w-3" /> {t.criteria - t.met} unmet
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

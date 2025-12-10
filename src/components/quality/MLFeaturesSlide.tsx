import { useState } from 'react';
import { 
  Activity, FileText, TestTube, Footprints, Pill, 
  Clock, User, Brain, ChevronRight, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  description: string;
}

const featureCategories: FeatureCategory[] = [
  {
    id: 'vitals',
    label: 'Vital Signs',
    icon: Activity,
    color: 'bg-red-500',
    description: 'Real-time physiological measurements',
    features: [
      'Systolic BP',
      'Diastolic BP',
      'Heart Rate',
      'Respiratory Rate',
      'Temperature',
      'SpO2',
      'BP Trend (24h)',
      'HR Variability',
    ],
  },
  {
    id: 'assessments',
    label: 'Nursing Assessments',
    icon: FileText,
    color: 'bg-blue-500',
    description: 'Validated clinical assessment scales',
    features: [
      'Morse Fall Scale',
      'Braden Scale Total',
      'Braden Mobility',
      'Braden Moisture',
      'Braden Nutrition',
      'CAUTI Bundle Compliance',
      'Pain Score',
      'Glasgow Coma Scale',
    ],
  },
  {
    id: 'labs',
    label: 'Laboratory Values',
    icon: TestTube,
    color: 'bg-emerald-500',
    description: 'Key lab results and trends',
    features: [
      'Hemoglobin',
      'Albumin',
      'Creatinine',
      'BUN',
      'WBC Count',
      'Sodium',
      'Potassium',
      'Glucose',
    ],
  },
  {
    id: 'mobility',
    label: 'Mobility & Function',
    icon: Footprints,
    color: 'bg-amber-500',
    description: 'Physical function indicators',
    features: [
      'Ambulation Status',
      'Assistive Device Use',
      'Bed Mobility Score',
      'Transfer Ability',
      'Gait Stability',
      'Fall History (30d)',
      'Physical Therapy Consult',
      'Activity Level',
    ],
  },
  {
    id: 'medications',
    label: 'Medications',
    icon: Pill,
    color: 'bg-purple-500',
    description: 'High-risk medication exposure',
    features: [
      'Sedatives Active',
      'Opioids Active',
      'Anticoagulants',
      'Diuretics',
      'Antihypertensives',
      'Psychotropics',
      'Polypharmacy Count',
    ],
  },
  {
    id: 'temporal',
    label: 'Temporal Factors',
    icon: Clock,
    color: 'bg-cyan-500',
    description: 'Time-based risk patterns',
    features: [
      'Hours Since Admission',
      'Days Post-Surgery',
      'Time of Day',
      'Shift (Day/Night)',
      'Hours Since Last Assessment',
      'Catheter Days',
    ],
  },
  {
    id: 'demographics',
    label: 'Demographics',
    icon: User,
    color: 'bg-slate-500',
    description: 'Patient characteristics',
    features: [
      'Age',
      'BMI',
    ],
  },
];

const totalFeatures = featureCategories.reduce((acc, cat) => acc + cat.features.length, 0);

export const MLFeaturesSlide = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Machine Learning Feature Set
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalFeatures} clinical features across {featureCategories.length} categories
        </p>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {featureCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              className={cn(
                "p-3 rounded-lg border-2 transition-all text-center",
                isSelected
                  ? `${category.color} text-white border-transparent shadow-lg scale-105`
                  : "bg-secondary/50 border-border/50 hover:border-primary/50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mx-auto mb-1",
                isSelected ? "text-white" : "text-foreground"
              )} />
              <div className={cn(
                "text-[10px] font-medium",
                isSelected ? "text-white" : "text-foreground"
              )}>
                {category.label}
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "mt-1 text-[9px]",
                  isSelected && "bg-white/20 text-white"
                )}
              >
                {category.features.length}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Feature Grid */}
      <div className="flex-1 overflow-auto">
        {selectedCategory ? (
          // Detailed view for selected category
          <Card className="h-full">
            <CardHeader className="pb-2">
              {(() => {
                const cat = featureCategories.find(c => c.id === selectedCategory);
                if (!cat) return null;
                const Icon = cat.icon;
                return (
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", cat.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-foreground">{cat.label}</span>
                      <div className="text-xs font-normal text-muted-foreground">
                        {cat.description}
                      </div>
                    </div>
                  </CardTitle>
                );
              })()}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {featureCategories
                  .find(c => c.id === selectedCategory)
                  ?.features.map((feature, idx) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <CheckCircle className={cn(
                        "w-4 h-4",
                        featureCategories.find(c => c.id === selectedCategory)?.color.replace('bg-', 'text-')
                      )} />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Overview grid showing all categories
          <div className="grid grid-cols-2 gap-4 h-full">
            {featureCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", category.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground">{category.label}</span>
                        <Badge variant="outline" className="ml-2 text-[9px]">
                          {category.features.length} features
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {category.features.slice(0, 6).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 rounded text-[10px] bg-secondary/80 text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                      {category.features.length > 6 && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-medium">
                          +{category.features.length - 6} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">{totalFeatures}</div>
            <div className="text-[10px] text-muted-foreground">Total Features</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{featureCategories.length}</div>
            <div className="text-[10px] text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-foreground">4</div>
            <div className="text-[10px] text-muted-foreground">NSO Outcomes</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="text-[10px] text-muted-foreground">Gradient Boosting</div>
          </CardContent>
        </Card>
      </div>

      {/* Note */}
      <div className="mt-3 text-center">
        <p className="text-[9px] text-muted-foreground italic">
          Features derived from validated clinical scales and EHR data elements. 
          Click a category to explore features. Feature importance varies by outcome.
        </p>
      </div>
    </div>
  );
};

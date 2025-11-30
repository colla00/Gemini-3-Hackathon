import { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from './DashboardOverview';
import { PatientListView } from './PatientListView';
import { ShapExplainability } from './ShapExplainability';
import { ClinicalWorkflowView } from './ClinicalWorkflowView';
import { QualityHeader } from './QualityHeader';
import { QualityFooter } from './QualityFooter';
import { ResearchBanner } from './ResearchBanner';

type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow';

const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'patients', label: 'Patient List', icon: <Users className="w-4 h-4" /> },
  { id: 'shap', label: 'SHAP Explainability', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'workflow', label: 'Clinical Workflow', icon: <GitBranch className="w-4 h-4" /> },
];

export const QualityDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'patients':
        return <PatientListView />;
      case 'shap':
        return <ShapExplainability />;
      case 'workflow':
        return <ClinicalWorkflowView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Cyan Header Stripe */}
      <div className="h-2 bg-primary w-full" />
      
      <ResearchBanner />
      <QualityHeader />

      {/* Navigation Tabs */}
      <nav className="px-4 md:px-8 lg:px-16 py-4 border-b border-border/30">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                activeView === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/30"
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 lg:px-16 py-8 pb-24">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>

      <QualityFooter />
    </div>
  );
};

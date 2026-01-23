import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BarChart3, Play, Clock, ChevronRight, Brain, Activity, 
  Users, GitBranch, Sparkles, GraduationCap, ShieldX, Award,
  FileText, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { Button } from '@/components/ui/button';

const ACCESS_KEY = 'presenter2025';
const EXPIRATION_DATE = new Date('2026-12-31T23:59:59'); // Extended for patent evidence
type DemoSection = {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // seconds
  icon: React.ReactNode;
  component: 'intro' | 'dashboard' | 'patients' | 'shap' | 'workflow' | 'outro';
  patentClaims?: string;
  patentDescription?: string;
};

const DEMO_SECTIONS: DemoSection[] = [
  { 
    id: 'intro', 
    title: 'NSO Quality Dashboard', 
    subtitle: 'AI-Assisted Nursing Quality Monitoring',
    duration: 15, 
    icon: <Brain className="w-8 h-8" />,
    component: 'intro',
    patentClaims: '80+ Claims',
    patentDescription: '4 U.S. Patents: Trust-Based Alerts • Risk Intelligence • Unified Platform • DBS'
  },
  { 
    id: 'dashboard', 
    title: 'Real-Time Overview', 
    subtitle: 'Unit-wide risk monitoring and metrics',
    duration: 65, 
    icon: <Activity className="w-6 h-6" />,
    component: 'dashboard',
    patentClaims: 'Claims 1-4',
    patentDescription: 'Multi-outcome risk prediction with confidence scoring'
  },
  { 
    id: 'patients', 
    title: 'Patient Worklist', 
    subtitle: 'Priority queue with live risk updates',
    duration: 70, 
    icon: <Users className="w-6 h-6" />,
    component: 'patients',
    patentClaims: 'Claims 1-4, 8-10',
    patentDescription: 'Priority scoring and nurse-sensitive outcome tracking'
  },
  { 
    id: 'shap', 
    title: 'Risk Attribution', 
    subtitle: 'SHAP-based explainability for clinical trust',
    duration: 70, 
    icon: <BarChart3 className="w-6 h-6" />,
    component: 'shap',
    patentClaims: 'Claims 1-4',
    patentDescription: 'SHAP-based explainability with cumulative risk attribution'
  },
  { 
    id: 'workflow', 
    title: 'Clinical Workflow', 
    subtitle: 'Intervention recommendations and outcomes',
    duration: 65, 
    icon: <GitBranch className="w-6 h-6" />,
    component: 'workflow',
    patentClaims: 'Claims 5-7, 11-20',
    patentDescription: 'Temporal forecasting, adaptive thresholds, closed-loop feedback'
  },
  { 
    id: 'outro', 
    title: 'Thank You', 
    subtitle: 'Questions welcome during live session',
    duration: 15, 
    icon: <GraduationCap className="w-8 h-8" />,
    component: 'outro',
    patentClaims: '4 U.S. Patents Filed',
    patentDescription: 'U.S. Provisional Applications, December 2025 – January 2026'
  },
];

const TOTAL_DURATION = DEMO_SECTIONS.reduce((acc, s) => acc + s.duration, 0);

export const RecordingDemo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isStarted, setIsStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionElapsed, setSectionElapsed] = useState(0);
  const liveSimulation = useLiveSimulation(true, 4000);

  // Check access key and expiration
  const accessKey = searchParams.get('key');
  const isExpired = new Date() > EXPIRATION_DATE;
  const hasAccess = accessKey === ACCESS_KEY && !isExpired;

  // Access denied screen
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/20 border-2 border-destructive/40 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isExpired ? 'Link Expired' : 'Access Restricted'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isExpired 
              ? 'This access link has expired.' 
              : 'This page requires a valid access link.'}
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const currentSection = DEMO_SECTIONS[currentSectionIndex];
  const progress = (elapsed / TOTAL_DURATION) * 100;
  const sectionProgress = (sectionElapsed / currentSection.duration) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate section start times
  const getSectionStartTime = (index: number) => {
    return DEMO_SECTIONS.slice(0, index).reduce((acc, s) => acc + s.duration, 0);
  };

  // Update current section based on elapsed time
  useEffect(() => {
    if (!isStarted) return;

    let accumulatedTime = 0;
    for (let i = 0; i < DEMO_SECTIONS.length; i++) {
      accumulatedTime += DEMO_SECTIONS[i].duration;
      if (elapsed < accumulatedTime) {
        setCurrentSectionIndex(i);
        setSectionElapsed(elapsed - getSectionStartTime(i));
        break;
      }
    }

    // End demo
    if (elapsed >= TOTAL_DURATION) {
      setIsStarted(false);
    }
  }, [elapsed, isStarted]);

  // Timer
  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    setElapsed(0);
    setCurrentSectionIndex(0);
    setSectionElapsed(0);
  }, []);

  const renderContent = () => {
    if (!isStarted) {
      // Pre-start screen
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="text-center max-w-2xl px-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              NSO Quality Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              AI-Assisted Nursing Quality Monitoring
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Research Prototype</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Demo Outline ({formatTime(TOTAL_DURATION)} total)</h3>
              <div className="space-y-2 text-left">
                {DEMO_SECTIONS.filter(s => s.component !== 'intro' && s.component !== 'outro').map((section, i) => (
                  <div key={section.id} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="text-foreground flex-1">{section.title}</span>
                    <span className="text-muted-foreground">{formatTime(section.duration)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to Patent Evidence */}
            <div className="bg-card border border-border rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Patent Evidence Documentation</h3>
                    <p className="text-xs text-muted-foreground">View all 20 claims with implementation details</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/patent-evidence?key=patent2025')}
                  className="gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Claims
                </Button>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleStart}
              className="gap-2 text-lg px-8 py-6"
            >
              <Play className="w-5 h-5" />
              Start Recording Demo
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Press play, then start your Zoom recording
            </p>
          </div>
        </div>
      );
    }

    // Intro slide
    if (currentSection.component === 'intro') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="text-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              NSO Quality Dashboard
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              AI-Assisted Nursing Quality Monitoring
            </p>
            <div className="flex items-center justify-center gap-3 text-lg text-primary">
              <Sparkles className="w-5 h-5" />
              <span>Research Prototype</span>
            </div>
            <p className="text-muted-foreground mt-6">
              Predictive Analytics for Falls, Pressure Injuries, CAUTI & Device Complications
            </p>
          </div>
        </div>
      );
    }

    // Outro slide
    if (currentSection.component === 'outro') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="text-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Thank You
            </h1>
            <p className="text-2xl text-muted-foreground mb-6">
              Questions welcome during the live session
            </p>
            <div className="flex items-center justify-center gap-3 text-lg text-primary mb-8">
              <span>December 10, 2025 • 10:30 AM PST</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>info@alexiscollier.com</p>
              <p className="mt-2 text-primary font-medium">4 U.S. Patents Filed • Research Prototype</p>
            </div>
          </div>
        </div>
      );
    }

    // Dashboard views
    return (
      <div className="flex-1 overflow-auto">
        {currentSection.component === 'dashboard' && <DashboardOverview liveSimulation={liveSimulation} />}
        {currentSection.component === 'patients' && <PatientListView liveSimulation={liveSimulation} />}
        {currentSection.component === 'shap' && <ShapExplainability />}
        {currentSection.component === 'workflow' && <ClinicalWorkflowView />}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Recording Header - Only visible during demo */}
      {isStarted && (
        <div className="bg-card border-b border-border py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Logo & Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-sm">NSO Dashboard</span>
              </div>
              
              {/* Current Section */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                {currentSection.icon}
                <div>
                  <div className="text-sm font-medium text-foreground">{currentSection.title}</div>
                  <div className="text-xs text-muted-foreground">{currentSection.subtitle}</div>
                </div>
              </div>

              {/* Patent Claims Badge with link */}
              {currentSection.patentClaims && (
                <button
                  onClick={() => window.open('/patent-evidence?key=patent2025', '_blank')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors"
                >
                  <Award className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-xs font-semibold text-accent">{currentSection.patentClaims}</div>
                    <div className="text-[10px] text-accent/80">{currentSection.patentDescription}</div>
                  </div>
                </button>
              )}
            </div>

            {/* Right: Timer */}
            <div className="flex items-center gap-4">
              {/* Section indicator */}
              <div className="flex items-center gap-1">
                {DEMO_SECTIONS.map((section, i) => (
                  <div
                    key={section.id}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i < currentSectionIndex ? "bg-primary" :
                      i === currentSectionIndex ? "bg-primary animate-pulse w-3" :
                      "bg-muted"
                    )}
                  />
                ))}
              </div>

              {/* Time remaining */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm font-medium text-foreground">
                  {formatTime(TOTAL_DURATION - elapsed)}
                </span>
                <span className="text-xs text-muted-foreground">remaining</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-7xl mx-auto mt-2">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}

      {/* End screen when demo completes */}
      {!isStarted && elapsed >= TOTAL_DURATION && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-risk-low/20 border-2 border-risk-low/40 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-risk-low" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Demo Complete!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Recording finished • {formatTime(TOTAL_DURATION)}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button onClick={handleStart}>
                <Play className="w-4 h-4 mr-2" />
                Record Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

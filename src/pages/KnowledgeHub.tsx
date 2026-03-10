import { useState } from 'react';
import { Lock, Unlock, LayoutDashboard, Scale, FileText, Building2, Presentation, HelpCircle, Contact, Menu, X, KanbanSquare, Mic, GraduationCap, BarChart3, Target, AlertTriangle, Rocket, Users, Shield, Briefcase } from 'lucide-react';
import HubDashboard from '@/components/hub/HubDashboard';
import HubPatents from '@/components/hub/HubPatents';
import HubManuscripts from '@/components/hub/HubManuscripts';
import HubCompany from '@/components/hub/HubCompany';
import HubPresentations from '@/components/hub/HubPresentations';
import HubQA from '@/components/hub/HubQA';
import HubContacts from '@/components/hub/HubContacts';
import HubKanban from '@/components/hub/HubKanban';
import HubScripts from '@/components/hub/HubScripts';
import HubIPClinic from '@/components/hub/HubIPClinic';
import HubAnalytics from '@/components/hub/HubAnalytics';
import Hub90DayTracker from '@/components/hub/Hub90DayTracker';
import HubStrategicGaps from '@/components/hub/HubStrategicGaps';
import HubRoadmap from '@/components/hub/HubRoadmap';
import HubCRM from '@/components/hub/HubCRM';
import HubPatentConversion from '@/components/hub/HubPatentConversion';
import HubHiring from '@/components/hub/HubHiring';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '90day', label: '90-Day Tracker', icon: Target },
  { id: 'gaps', label: 'Strategic Gaps', icon: AlertTriangle },
  { id: 'roadmap', label: 'Path to 10/10', icon: Rocket },
  { id: 'patents', label: 'Patent Portfolio', icon: Scale },
  { id: 'manuscripts', label: 'Manuscripts', icon: FileText },
  { id: 'company', label: 'Company & Legal', icon: Building2 },
  { id: 'presentations', label: 'Presentations', icon: Presentation },
  { id: 'qa', label: 'Q&A Prep', icon: HelpCircle },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'kanban', label: 'Project Tracker', icon: KanbanSquare },
  { id: 'scripts', label: 'Practice Scripts', icon: Mic },
  { id: 'ipclinic', label: 'IP Clinic Organizer', icon: GraduationCap },
  { id: 'analytics', label: 'Page Analytics', icon: BarChart3 },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

const KnowledgeHub = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLock = async () => {
    await signOut();
    navigate('/auth');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <HubDashboard />;
      case '90day': return <Hub90DayTracker />;
      case 'gaps': return <HubStrategicGaps />;
      case 'roadmap': return <HubRoadmap />;
      case 'patents': return <HubPatents />;
      case 'manuscripts': return <HubManuscripts />;
      case 'company': return <HubCompany />;
      case 'presentations': return <HubPresentations />;
      case 'qa': return <HubQA />;
      case 'contacts': return <HubContacts />;
      case 'kanban': return <HubKanban />;
      case 'scripts': return <HubScripts />;
      case 'ipclinic': return <HubIPClinic />;
      case 'analytics': return <HubAnalytics />;
    }
  };

  return (
    <div className="min-h-screen flex print:block" style={{ background: '#0f1729', color: '#fff' }}>
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg flex items-center justify-center border border-white/10"
        style={{ background: '#151f35' }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-60 border-r border-white/10 flex flex-col z-40 transition-transform print:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: '#0b1120' }}
      >
        <div className="p-5 border-b border-white/10">
          <h2 className="text-sm font-bold tracking-wide" style={{ color: '#00c8b4' }}>VitaSignal™</h2>
          <p className="text-[10px] text-white/50 mt-0.5">Internal Knowledge Hub</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Hub navigation">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'text-white font-medium' : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
                style={active ? { background: 'rgba(0,200,180,0.12)', color: '#00c8b4' } : undefined}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <p className="text-[10px] text-white/40 px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={handleLock}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <Unlock className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b border-white/10 px-4 md:px-6 h-12 flex items-center justify-between print:hidden" style={{ background: '#0f1729' }}>
          <div className="flex items-center gap-3 ml-12 md:ml-0">
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">CONFIDENTIAL</span>
          </div>
          <button
            onClick={handleLock}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-red-400 transition-colors font-medium"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Hub
          </button>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Watermark */}
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0 print:hidden" style={{ opacity: 0.03 }}>
            <span className="text-6xl md:text-8xl font-bold text-white rotate-[-30deg] select-none whitespace-nowrap">CONFIDENTIAL — VitaSignal LLC</span>
          </div>
          <div className="relative z-10">
            {renderSection()}
            <p className="text-[10px] text-white/30 mt-12 text-center">Last updated: March 2026</p>
          </div>
        </div>
      </main>

      {/* Floating lock button */}
      <button
        onClick={handleLock}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/10 print:hidden transition-transform hover:scale-110"
        style={{ background: '#151f35' }}
        title="Lock Hub"
        aria-label="Lock hub and sign out"
      >
        <Lock className="w-5 h-5 text-red-400" />
      </button>
    </div>
  );
};

export default KnowledgeHub;

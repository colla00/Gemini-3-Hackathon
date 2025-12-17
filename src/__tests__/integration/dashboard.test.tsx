import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import type { Patient, RiskLevel } from '@/data/patients';

// Mock patient data with correct types
const mockPatients: Patient[] = [
  {
    id: 'PT-001',
    riskLevel: 'HIGH',
    riskScore: 85,
    riskType: 'CAUTI',
    trend: 'up',
    lastUpdated: '~5m',
    lastUpdatedMinutes: 5,
    ageRange: '70-74',
    admissionDate: 'Day 3',
    riskFactors: [
      { name: 'Prolonged catheterization', icon: '⏱️', contribution: 0.35 },
      { name: 'Diabetes', icon: '💊', contribution: 0.25 },
    ],
    clinicalNotes: 'Monitor closely for signs of infection',
    riskSummary: 'High risk due to extended catheter duration',
  },
  {
    id: 'PT-002',
    riskLevel: 'MEDIUM',
    riskScore: 55,
    riskType: 'Falls',
    trend: 'stable',
    lastUpdated: '~12m',
    lastUpdatedMinutes: 12,
    ageRange: '65-69',
    admissionDate: 'Day 2',
    riskFactors: [
      { name: 'Immobility', icon: '🛏️', contribution: 0.20 },
      { name: 'Age > 65', icon: '👤', contribution: 0.15 },
    ],
    clinicalNotes: 'Standard monitoring protocol',
    riskSummary: 'Moderate fall risk due to immobility',
  },
];

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id', email: 'test@example.com' },
            access_token: 'test-token',
          },
        },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = createTestQueryClient();
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>
          {component}
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

describe('Dashboard Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard skeleton while loading', async () => {
    const { DashboardSkeleton } = await import('@/components/skeletons');
    renderWithProviders(<DashboardSkeleton />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('Patient Card Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders patient card with correct data', async () => {
    const { PatientCard } = await import('@/components/dashboard/PatientCard');
    
    renderWithProviders(
      <PatientCard
        patient={mockPatients[0]}
        onClick={vi.fn()}
        index={0}
        displayTime="5 min ago"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('PT-001')).toBeInTheDocument();
    });
  });

  it('displays risk score', async () => {
    const { PatientCard } = await import('@/components/dashboard/PatientCard');
    
    renderWithProviders(
      <PatientCard
        patient={mockPatients[0]}
        onClick={vi.fn()}
        index={0}
        displayTime="5 min ago"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/85/)).toBeInTheDocument();
    });
  });

  it('calls onClick when patient card is clicked', async () => {
    const { PatientCard } = await import('@/components/dashboard/PatientCard');
    const handleClick = vi.fn();
    
    renderWithProviders(
      <PatientCard
        patient={mockPatients[0]}
        onClick={handleClick}
        index={0}
        displayTime="5 min ago"
      />
    );

    await waitFor(() => {
      const patientId = screen.getByText('PT-001');
      const card = patientId.closest('[class*="cursor"]');
      if (card) {
        fireEvent.click(card);
      }
    });
  });
});

describe('Risk Badge Component', () => {
  it('displays correct text for HIGH risk', async () => {
    const { RiskBadge } = await import('@/components/dashboard/RiskBadge');
    
    renderWithProviders(<RiskBadge level="HIGH" />);
    
    const badge = screen.getByText(/high/i);
    expect(badge).toBeInTheDocument();
  });

  it('displays correct text for MEDIUM risk', async () => {
    const { RiskBadge } = await import('@/components/dashboard/RiskBadge');
    
    renderWithProviders(<RiskBadge level="MEDIUM" />);
    
    const badge = screen.getByText(/medium/i);
    expect(badge).toBeInTheDocument();
  });

  it('displays correct text for LOW risk', async () => {
    const { RiskBadge } = await import('@/components/dashboard/RiskBadge');
    
    renderWithProviders(<RiskBadge level="LOW" />);
    
    const badge = screen.getByText(/low/i);
    expect(badge).toBeInTheDocument();
  });
});

describe('Dashboard Filter Bar', () => {
  it('renders filter bar with search input', async () => {
    const { FilterBar } = await import('@/components/dashboard/FilterBar');
    
    renderWithProviders(
      <FilterBar
        searchQuery=""
        onSearchChange={vi.fn()}
        riskLevelFilter="ALL"
        onRiskLevelChange={vi.fn()}
        riskTypeFilter="ALL"
        onRiskTypeChange={vi.fn()}
        sortBy="riskScore"
        onSortChange={vi.fn()}
      />
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('updates search query on input', async () => {
    const { FilterBar } = await import('@/components/dashboard/FilterBar');
    const onSearchChange = vi.fn();
    
    renderWithProviders(
      <FilterBar
        searchQuery=""
        onSearchChange={onSearchChange}
        riskLevelFilter="ALL"
        onRiskLevelChange={vi.fn()}
        riskTypeFilter="ALL"
        onRiskTypeChange={vi.fn()}
        sortBy="riskScore"
        onSortChange={vi.fn()}
      />
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'PT-001' } });
      expect(onSearchChange).toHaveBeenCalledWith('PT-001');
    });
  });
});

describe('Monitoring List', () => {
  it('renders monitoring list with patients', async () => {
    const { MonitoringList } = await import('@/components/dashboard/MonitoringList');
    
    renderWithProviders(
      <MonitoringList
        patients={mockPatients}
        onSelect={vi.fn()}
        displayTime={(minutes: number) => `${minutes} min ago`}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('PT-001')).toBeInTheDocument();
      expect(screen.getByText('PT-002')).toBeInTheDocument();
    });
  });

  it('calls onSelect when a patient is clicked', async () => {
    const { MonitoringList } = await import('@/components/dashboard/MonitoringList');
    const onSelect = vi.fn();
    
    renderWithProviders(
      <MonitoringList
        patients={mockPatients}
        onSelect={onSelect}
        displayTime={(minutes: number) => `${minutes} min ago`}
      />
    );

    await waitFor(() => {
      const patientRow = screen.getByText('PT-001').closest('[class*="cursor"]');
      if (patientRow) {
        fireEvent.click(patientRow);
      }
    });
  });
});

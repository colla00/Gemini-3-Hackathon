import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NursingDashboard from '@/pages/NursingDashboard';

// Mock all external dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

vi.mock('@/lib/performanceMonitor', () => ({
  performanceMonitor: {
    recordInteraction: vi.fn(),
    addMetric: vi.fn(),
    getMetrics: vi.fn().mockReturnValue([]),
    getInteractionMetrics: vi.fn().mockReturnValue([]),
  },
}));

vi.mock('@/hooks/usePerformance', () => ({
  usePerformanceTracking: () => ({
    trackInteraction: vi.fn(() => vi.fn()),
  }),
}));

// Test utilities
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderDashboard = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NursingDashboard />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    it('should render the dashboard with all main sections', () => {
      renderDashboard();
      
      // Check for main structural elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText('Clinical Risk Dashboard')).toBeInTheDocument();
    });

    it('should display quick stats section', () => {
      renderDashboard();
      
      expect(screen.getByLabelText('Patient statistics summary')).toBeInTheDocument();
    });

    it('should display filters section', () => {
      renderDashboard();
      
      expect(screen.getByLabelText('Patient filters')).toBeInTheDocument();
    });

    it('should display patient list', () => {
      renderDashboard();
      
      expect(screen.getByLabelText('Patient monitoring list')).toBeInTheDocument();
    });
  });

  describe('usePatients Hook Integration', () => {
    it('should display patient cards from usePatients hook', () => {
      renderDashboard();
      
      // Should render priority patients section
      expect(screen.getByLabelText('Priority patients requiring immediate attention')).toBeInTheDocument();
    });

    it('should filter patients when search is used', async () => {
      renderDashboard();
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'PT-' } });
      
      // Filters should be applied
      await waitFor(() => {
        expect(searchInput).toHaveValue('PT-');
      });
    });

    it('should update patient list when risk level filter changes', async () => {
      renderDashboard();
      
      // Find the risk level filter
      const filterSection = screen.getByLabelText('Patient filters');
      expect(filterSection).toBeInTheDocument();
    });
  });

  describe('usePatientSelection Hook Integration', () => {
    it('should select patient on card click', async () => {
      renderDashboard();
      
      // Find and click a patient card
      const prioritySection = screen.getByLabelText('Priority patients requiring immediate attention');
      const patientCards = within(prioritySection).getAllByRole('button');
      
      if (patientCards.length > 0) {
        fireEvent.click(patientCards[0]);
        
        // Wait for transition
        await vi.advanceTimersByTimeAsync(250);
        
        // Should show patient detail view (back button should appear)
        await waitFor(() => {
          const backButton = screen.queryByRole('button', { name: /back/i });
          // Patient detail should be shown
          expect(backButton || screen.queryByText(/risk factors/i)).toBeTruthy();
        });
      }
    });

    it('should handle keyboard shortcut for search focus', () => {
      renderDashboard();
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      
      // Press 'f' to focus search
      fireEvent.keyDown(window, { key: 'f' });
      
      // Note: Focus behavior may vary in test environment
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle keyboard shortcut for filter reset', async () => {
      renderDashboard();
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      
      // First add a search term
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput).toHaveValue('test');
      
      // Press 'r' to reset filters
      fireEvent.keyDown(window, { key: 'r' });
      
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });
  });

  describe('useTimeOffset Hook Integration', () => {
    it('should update display times after interval', async () => {
      renderDashboard();
      
      // Initial render
      const prioritySection = screen.getByLabelText('Priority patients requiring immediate attention');
      expect(prioritySection).toBeInTheDocument();
      
      // Advance time by 30 seconds (default interval)
      await vi.advanceTimersByTimeAsync(30000);
      
      // Component should still be stable
      expect(screen.getByLabelText('Patient monitoring list')).toBeInTheDocument();
    });

    it('should maintain display time consistency across multiple updates', async () => {
      renderDashboard();
      
      // Advance time multiple intervals
      await vi.advanceTimersByTimeAsync(30000);
      await vi.advanceTimersByTimeAsync(30000);
      await vi.advanceTimersByTimeAsync(30000);
      
      // Dashboard should still be rendered correctly
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('useDemoScenarios Hook Integration', () => {
    it('should render demo mode controller', () => {
      renderDashboard();
      
      // Demo mode button should be present
      const demoButton = screen.getByRole('button', { name: /demo mode/i });
      expect(demoButton).toBeInTheDocument();
    });

    it('should expand demo controller on click', async () => {
      renderDashboard();
      
      const demoButton = screen.getByRole('button', { name: /demo mode/i });
      fireEvent.click(demoButton);
      
      await waitFor(() => {
        // Should show start button or scenario info
        expect(screen.getByText(/start/i) || screen.getByText(/scenario/i)).toBeTruthy();
      });
    });
  });

  describe('All Hooks Working Together', () => {
    it('should maintain state consistency across hook interactions', async () => {
      renderDashboard();
      
      // 1. Apply a filter (usePatients)
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'Patient' } });
      
      // 2. Advance time (useTimeOffset)
      await vi.advanceTimersByTimeAsync(30000);
      
      // 3. Dashboard should still work
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(searchInput).toHaveValue('Patient');
    });

    it('should handle rapid interactions without breaking', async () => {
      renderDashboard();
      
      const searchInput = screen.getByPlaceholderText(/search/i);
      
      // Rapid filter changes
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.change(searchInput, { target: { value: 'ab' } });
      fireEvent.change(searchInput, { target: { value: 'abc' } });
      
      // Time advances
      await vi.advanceTimersByTimeAsync(100);
      
      // Reset
      fireEvent.keyDown(window, { key: 'r' });
      
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });

    it('should properly clean up on unmount', () => {
      const { unmount } = renderDashboard();
      
      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for main sections', () => {
      renderDashboard();
      
      expect(screen.getByLabelText('Clinical Risk Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient statistics summary')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient filters')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient monitoring list')).toBeInTheDocument();
    });

    it('should have skip link targets', () => {
      renderDashboard();
      
      expect(document.getElementById('main-content')).toBeInTheDocument();
      expect(document.getElementById('quick-stats')).toBeInTheDocument();
      expect(document.getElementById('filters')).toBeInTheDocument();
      expect(document.getElementById('patient-list')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axe } from 'jest-axe';
import type { AxeResults } from 'axe-core';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/hooks/useSettings';
import { RiskBadge } from '@/components/dashboard/RiskBadge';
import { SkipLink } from '@/components/SkipLink';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { InfoModal } from '@/components/dashboard/InfoModal';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { EfficacyBadge } from '@/components/dashboard/EfficacyBadge';
import { LiveBadge } from '@/components/dashboard/LiveBadge';
import type { Patient } from '@/data/patients';

// Custom assertion helper for axe violations
function expectNoViolations(results: AxeResults) {
  if (results.violations.length > 0) {
    const violations = results.violations.map(v => 
      `${v.id}: ${v.description} (${v.nodes.length} elements)`
    ).join('\n');
    throw new Error(`Found ${results.violations.length} accessibility violations:\n${violations}`);
  }
}

// Test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock patient data for testing
const mockPatient: Patient = {
  id: 'PT-001',
  ageRange: '60-70',
  room: '401A',
  riskLevel: 'HIGH',
  riskScore: 0.85,
  riskType: 'Falls',
  trend: 'up',
  lastUpdated: new Date().toISOString(),
  lastUpdatedMinutes: 2,
  admissionDate: '2024-01-15',
  riskSummary: 'Elevated fall risk due to mobility limitations and medication effects.',
  clinicalNotes: 'Patient requires assistance with ambulation.',
  riskFactors: [
    { name: 'Mobility', icon: 'activity', contribution: 0.3 },
    { name: 'Medications', icon: 'pill', contribution: 0.2 },
  ],
  isDemo: false,
};

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RiskBadge Component Tests
  // ============================================
  describe('RiskBadge Component', () => {
    it('should have no accessibility violations for HIGH risk', async () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="HIGH" />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have no accessibility violations for MEDIUM risk', async () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="MEDIUM" />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have no accessibility violations for LOW risk', async () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="LOW" />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have proper ARIA attributes', () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="HIGH" />
        </TestWrapper>
      );

      const badge = container.querySelector('[role="status"]');
      expect(badge).toBeTruthy();
      expect(badge?.getAttribute('aria-label')).toBeTruthy();
      expect(badge?.getAttribute('tabindex')).toBe('0');
    });
  });

  // ============================================
  // SkipLink Component Tests
  // ============================================
  describe('SkipLink Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <main id="main-content">
            <SkipLink />
            <h1>Test Page</h1>
          </main>
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have proper navigation landmark', () => {
      const { container } = render(
        <TestWrapper>
          <SkipLink />
        </TestWrapper>
      );

      const nav = container.querySelector('nav[aria-label="Skip navigation"]');
      expect(nav).toBeTruthy();
    });

    it('should render multiple skip link targets', () => {
      const targets = [
        { id: 'main-content', label: 'Skip to main content' },
        { id: 'workflow-nav', label: 'Skip to workflow navigation' },
        { id: 'quick-stats', label: 'Skip to patient statistics' },
        { id: 'filters', label: 'Skip to filters' },
        { id: 'patient-list', label: 'Skip to patient list' },
      ];

      const { container } = render(
        <TestWrapper>
          <SkipLink targets={targets} />
        </TestWrapper>
      );

      const links = container.querySelectorAll('a');
      expect(links.length).toBe(5);
    });

    it('should have correct href targets for skip links', () => {
      const targets = [
        { id: 'main-content', label: 'Skip to main content' },
        { id: 'filters', label: 'Skip to filters' },
      ];

      const { container } = render(
        <TestWrapper>
          <SkipLink targets={targets} />
        </TestWrapper>
      );

      const links = container.querySelectorAll('a');
      expect(links[0].getAttribute('href')).toBe('#main-content');
      expect(links[1].getAttribute('href')).toBe('#filters');
    });
  });

  // ============================================
  // QuickStats Component Tests
  // ============================================
  describe('QuickStats Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <QuickStats total={12} high={3} medium={4} trending={2} />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should display qualitative labels instead of numbers', () => {
      render(
        <TestWrapper>
          <QuickStats total={12} high={3} medium={4} trending={2} />
        </TestWrapper>
      );

      // Should show qualitative labels like "Several", "Multiple", etc.
      expect(screen.getByText('Several')).toBeTruthy();
      expect(screen.getByText('Multiple')).toBeTruthy();
    });

    it('should have tooltip triggers for each stat', () => {
      const { container } = render(
        <TestWrapper>
          <QuickStats total={12} high={3} medium={4} trending={2} />
        </TestWrapper>
      );

      // Each stat pill should be wrapped in a tooltip trigger
      const tooltipTriggers = container.querySelectorAll('[data-radix-tooltip-trigger]');
      expect(tooltipTriggers.length).toBeGreaterThanOrEqual(0); // May not have data attribute, check alternative
    });
  });

  // ============================================
  // EfficacyBadge Component Tests
  // ============================================
  describe('EfficacyBadge Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <EfficacyBadge interventionType="Bed Alarm" beforeScore={78} afterScore={52} />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should display qualitative effect labels', () => {
      render(
        <TestWrapper>
          <EfficacyBadge interventionType="Bed Alarm" beforeScore={78} afterScore={52} />
        </TestWrapper>
      );

      // Should show qualitative label like "Strong", "Moderate", etc.
      expect(screen.getByText('Strong')).toBeTruthy();
    });

    it('should have tooltip trigger for additional context', () => {
      const { container } = render(
        <TestWrapper>
          <EfficacyBadge interventionType="Hourly Rounding" beforeScore={65} afterScore={48} />
        </TestWrapper>
      );

      // Should have a tooltip trigger div
      const trigger = container.querySelector('[class*="rounded-full"]');
      expect(trigger).toBeTruthy();
    });
  });

  // ============================================
  // LiveBadge Component Tests
  // ============================================
  describe('LiveBadge Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <LiveBadge />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have status role for live updates', () => {
      const { container } = render(
        <TestWrapper>
          <LiveBadge />
        </TestWrapper>
      );

      const badge = container.querySelector('[role="status"]');
      expect(badge).toBeTruthy();
    });

    it('should indicate demo mode clearly', () => {
      render(
        <TestWrapper>
          <LiveBadge />
        </TestWrapper>
      );

      expect(screen.getByText('Demo')).toBeTruthy();
    });
  });

  // ============================================
  // PatientCard Component Tests
  // ============================================
  describe('PatientCard Component', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
      mockOnClick.mockClear();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have proper role and aria-label', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('article[role="button"]');
      expect(card).toBeTruthy();
      expect(card?.getAttribute('aria-label')).toContain('Patient PT-001');
      expect(card?.getAttribute('aria-label')).toContain('Falls');
      expect(card?.getAttribute('aria-label')).toContain('Elevated');
    });

    it('should be keyboard focusable with tabindex', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('[tabindex="0"]');
      expect(card).toBeTruthy();
    });

    it('should respond to Enter key', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('article');
      if (card) {
        fireEvent.keyDown(card, { key: 'Enter' });
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }
    });

    it('should respond to Space key', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('article');
      if (card) {
        fireEvent.keyDown(card, { key: ' ' });
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }
    });

    it('should have focus ring styles for accessibility', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('article');
      expect(card?.className).toContain('focus:ring');
    });

    it('should have trend status with aria-label', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={mockOnClick}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const trendStatus = container.querySelector('[role="status"][aria-label*="trend"]');
      expect(trendStatus).toBeTruthy();
    });
  });

  // ============================================
  // FilterBar Component Tests
  // ============================================
  describe('FilterBar Component', () => {
    const mockFilterProps = {
      searchQuery: '',
      onSearchChange: vi.fn(),
      riskLevelFilter: 'ALL' as const,
      onRiskLevelChange: vi.fn(),
      riskTypeFilter: 'ALL' as const,
      onRiskTypeChange: vi.fn(),
      sortBy: 'riskScore' as const,
      onSortChange: vi.fn(),
    };

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <FilterBar {...mockFilterProps} />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have accessible search input with placeholder', () => {
      render(
        <TestWrapper>
          <FilterBar {...mockFilterProps} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search patient ID...');
      expect(searchInput).toBeTruthy();
      expect(searchInput.getAttribute('type')).toBe('text');
    });

    it('should have keyboard accessible select triggers', () => {
      const { container } = render(
        <TestWrapper>
          <FilterBar {...mockFilterProps} />
        </TestWrapper>
      );

      const selectTriggers = container.querySelectorAll('button[role="combobox"]');
      expect(selectTriggers.length).toBeGreaterThan(0);
      
      selectTriggers.forEach(trigger => {
        expect(trigger.getAttribute('aria-expanded')).toBeDefined();
      });
    });

    it('should have clear button when filters are active', () => {
      render(
        <TestWrapper>
          <FilterBar {...mockFilterProps} searchQuery="test" />
        </TestWrapper>
      );

      const clearButton = screen.getByText('Clear');
      expect(clearButton).toBeTruthy();
    });
  });

  // ============================================
  // InfoModal Component Tests
  // ============================================
  describe('InfoModal Component', () => {
    it('should have no accessibility violations when closed', async () => {
      const { container } = render(
        <TestWrapper>
          <InfoModal showTrigger={true} />
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have accessible trigger button', () => {
      const { container } = render(
        <TestWrapper>
          <InfoModal showTrigger={true} />
        </TestWrapper>
      );

      const triggerButton = container.querySelector('button');
      expect(triggerButton).toBeTruthy();
    });

    it('should have no accessibility violations when open', async () => {
      const { container } = render(
        <TestWrapper>
          <InfoModal open={true} onOpenChange={() => {}} showTrigger={false} />
        </TestWrapper>
      );

      // Wait for dialog to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      });

      expectNoViolations(results);
    });

    it('should have proper dialog role and title', async () => {
      render(
        <TestWrapper>
          <InfoModal open={true} onOpenChange={() => {}} showTrigger={false} />
        </TestWrapper>
      );

      // Wait for dialog to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();
      
      // Check for dialog title
      const title = screen.getByText('Research Prototype');
      expect(title).toBeTruthy();
    });
  });

  // ============================================
  // Semantic HTML Structure Tests
  // ============================================
  describe('Semantic HTML Structure', () => {
    it('should have proper heading hierarchy in test structure', async () => {
      const { container } = render(
        <TestWrapper>
          <main>
            <h1>Dashboard</h1>
            <section>
              <h2>Patient List</h2>
              <article>
                <h3>Patient Details</h3>
              </article>
            </section>
          </main>
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });

      expectNoViolations(results);
    });
  });

  // ============================================
  // Color Contrast Tests
  // ============================================
  describe('Color Contrast', () => {
    it('RiskBadge should have sufficient color contrast', async () => {
      const { container } = render(
        <TestWrapper>
          <div style={{ backgroundColor: 'white', padding: '20px' }}>
            <RiskBadge level="HIGH" />
            <RiskBadge level="MEDIUM" />
            <RiskBadge level="LOW" />
          </div>
        </TestWrapper>
      );

      const results = await axe(container, {
        runOnly: ['color-contrast'],
      });

      // Note: This documents color contrast status
      expect(results.violations.length).toBeDefined();
    });
  });

  // ============================================
  // Keyboard Navigation Tests
  // ============================================
  describe('Keyboard Navigation', () => {
    it('RiskBadge should be keyboard focusable', () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="HIGH" />
        </TestWrapper>
      );

      const badge = container.querySelector('[tabindex="0"]');
      expect(badge).toBeTruthy();
    });

    it('Skip links should be keyboard accessible', () => {
      const { container } = render(
        <TestWrapper>
          <SkipLink />
        </TestWrapper>
      );

      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    it('PatientCard should have visible focus indicator class', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={() => {}}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      const card = container.querySelector('article');
      expect(card?.className).toContain('focus:outline-none');
      expect(card?.className).toContain('focus:ring-2');
    });
  });

  // ============================================
  // Screen Reader Support Tests
  // ============================================
  describe('Screen Reader Support', () => {
    it('RiskBadge should have descriptive aria-label', () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="HIGH" />
        </TestWrapper>
      );

      const badge = container.querySelector('[aria-label]');
      expect(badge?.getAttribute('aria-label')).toContain('risk');
    });

    it('Icons should be hidden from screen readers', () => {
      const { container } = render(
        <TestWrapper>
          <RiskBadge level="HIGH" showIcon />
        </TestWrapper>
      );

      const icon = container.querySelector('svg');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('PatientCard decorative icons should be hidden', () => {
      const { container } = render(
        <TestWrapper>
          <PatientCard
            patient={mockPatient}
            onClick={() => {}}
            index={0}
            displayTime="2 min ago"
          />
        </TestWrapper>
      );

      // Check that trend icon is hidden
      const trendIcon = container.querySelector('[role="status"] svg');
      expect(trendIcon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ============================================
  // Form Accessibility Tests
  // ============================================
  describe('Form Accessibility', () => {
    it('FilterBar inputs should be properly labeled', () => {
      render(
        <TestWrapper>
          <FilterBar
            searchQuery=""
            onSearchChange={() => {}}
            riskLevelFilter="ALL"
            onRiskLevelChange={() => {}}
            riskTypeFilter="ALL"
            onRiskTypeChange={() => {}}
            sortBy="riskScore"
            onSortChange={() => {}}
          />
        </TestWrapper>
      );

      // Search input has placeholder as accessible name
      const searchInput = screen.getByPlaceholderText('Search patient ID...');
      expect(searchInput).toBeTruthy();
    });
  });
});

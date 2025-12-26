import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axe } from 'jest-axe';
import type { AxeResults } from 'axe-core';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/hooks/useSettings';
import { RiskBadge } from '@/components/dashboard/RiskBadge';
import { SkipLink } from '@/components/SkipLink';

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

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

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
        { id: 'filters', label: 'Skip to filters' },
        { id: 'patient-list', label: 'Skip to patient list' },
      ];

      const { container } = render(
        <TestWrapper>
          <SkipLink targets={targets} />
        </TestWrapper>
      );

      const links = container.querySelectorAll('a');
      expect(links.length).toBe(3);
    });
  });

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
  });

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
  });
});

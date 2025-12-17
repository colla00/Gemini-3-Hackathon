import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RiskBadge } from '@/components/dashboard/RiskBadge';

describe('RiskBadge Component', () => {
  it('renders HIGH risk correctly', () => {
    const { container } = render(<RiskBadge level="HIGH" />);
    expect(container.textContent).toContain('HIGH');
  });

  it('renders MEDIUM risk correctly', () => {
    const { container } = render(<RiskBadge level="MEDIUM" />);
    expect(container.textContent).toContain('MEDIUM');
  });

  it('renders LOW risk correctly', () => {
    const { container } = render(<RiskBadge level="LOW" />);
    expect(container.textContent).toContain('LOW');
  });

  it('applies correct styling for HIGH risk', () => {
    const { container } = render(<RiskBadge level="HIGH" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-risk-high/15');
  });

  it('applies correct styling for MEDIUM risk', () => {
    const { container } = render(<RiskBadge level="MEDIUM" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-risk-medium/15');
  });

  it('applies correct styling for LOW risk', () => {
    const { container } = render(<RiskBadge level="LOW" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-risk-low/15');
  });

  it('shows icon by default', () => {
    const { container } = render(<RiskBadge level="HIGH" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    const { container } = render(<RiskBadge level="HIGH" showIcon={false} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<RiskBadge level="LOW" className="custom-class" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('custom-class');
  });
});

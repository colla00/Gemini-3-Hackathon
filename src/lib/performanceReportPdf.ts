// PDF export for performance reports
import jsPDF from 'jspdf';
import type { PerformanceSummary } from '@/hooks/usePerformanceDashboard';
import type { BaselineMetrics, RegressionAlert } from '@/hooks/usePerformanceRegression';

export interface PerformanceReportData {
  summary: PerformanceSummary;
  baseline: BaselineMetrics | null;
  alerts: RegressionAlert[];
  projectName?: string;
  generatedAt: Date;
}

const formatMs = (value: number): string => `${value.toFixed(2)}ms`;
const formatMB = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(2)}MB`;

export const generatePerformanceReportPdf = (data: PerformanceReportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Helper functions
  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5;
  };

  const addText = (text: string, size: number = 10) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.text(text, margin, y);
    y += size * 0.5;
  };

  const addMetricRow = (label: string, value: string, baseline?: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin, y);
    doc.text(value, margin + 80, y);
    if (baseline) {
      doc.setTextColor(100, 100, 100);
      doc.text(`(baseline: ${baseline})`, margin + 120, y);
      doc.setTextColor(0, 0, 0);
    }
    y += 6;
  };

  const addSectionDivider = () => {
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Report', margin, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.projectName || 'Lovable Application', margin, 28);
  
  doc.setFontSize(9);
  doc.text(`Generated: ${data.generatedAt.toLocaleString()}`, pageWidth - margin - 60, 28);
  
  doc.setTextColor(0, 0, 0);
  y = 50;

  // Executive Summary
  addTitle('Executive Summary');
  y += 5;
  
  const status = data.alerts.some(a => a.severity === 'critical' && !a.acknowledged) 
    ? 'Critical' 
    : data.alerts.some(a => a.severity === 'warning' && !a.acknowledged)
      ? 'Warning'
      : 'Healthy';
  
  const statusColor = status === 'Critical' ? [220, 38, 38] : status === 'Warning' ? [217, 119, 6] : [22, 163, 74];
  doc.setFillColor(...statusColor as [number, number, number]);
  doc.roundedRect(margin, y, 80, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: ${status}`, margin + 10, y + 13);
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Metrics Collected: ${data.summary.totalMetrics}`, margin + 90, y + 8);
  doc.text(`Active Alerts: ${data.alerts.filter(a => !a.acknowledged).length}`, margin + 90, y + 16);
  
  y += 30;
  addSectionDivider();

  // Web Vitals
  checkPageBreak(50);
  addTitle('Web Vitals');
  y += 5;
  
  addMetricRow('Page Load', formatMs(data.summary.webVitals.pageLoad));
  addMetricRow('First Contentful Paint (FCP)', formatMs(data.summary.webVitals.fcp));
  addMetricRow('Time to Interactive (TTI)', formatMs(data.summary.webVitals.tti));
  
  addSectionDivider();

  // Runtime Metrics
  checkPageBreak(40);
  addTitle('Runtime Metrics');
  y += 5;
  
  addMetricRow('Average Interaction Time', formatMs(data.summary.avgInteractionTime));
  if (data.summary.memoryUsage) {
    addMetricRow('Memory Usage', formatMB(data.summary.memoryUsage));
  }
  
  addSectionDivider();

  // Hook Performance
  checkPageBreak(60);
  addTitle('Hook Performance');
  y += 5;
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Hook Name', margin + 3, y + 6);
  doc.text('Avg Render', margin + 60, y + 6);
  doc.text('Total Renders', margin + 100, y + 6);
  doc.text('Violations', margin + 140, y + 6);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  data.summary.hookMetrics.forEach(hook => {
    checkPageBreak(8);
    doc.text(hook.name, margin + 3, y + 4);
    doc.text(formatMs(hook.avgRenderTime), margin + 60, y + 4);
    doc.text(hook.totalRenders.toString(), margin + 100, y + 4);
    
    if (hook.violations > 0) {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(hook.violations.toString(), margin + 140, y + 4);
    doc.setTextColor(0, 0, 0);
    
    y += 7;
  });
  
  addSectionDivider();

  // Baseline Comparison
  if (data.baseline) {
    checkPageBreak(50);
    addTitle('Baseline Comparison');
    y += 5;
    
    addText(`Baseline captured: ${new Date(data.baseline.timestamp).toLocaleString()}`);
    addText(`Samples collected: ${data.baseline.sampleCount}`);
    y += 5;
    
    addMetricRow('Avg Render Time', 
      formatMs(data.summary.hookMetrics.reduce((s, h) => s + h.avgRenderTime, 0) / Math.max(data.summary.hookMetrics.length, 1)),
      formatMs(data.baseline.avgRenderTime)
    );
    addMetricRow('FCP', formatMs(data.summary.webVitals.fcp), formatMs(data.baseline.fcp));
    addMetricRow('TTI', formatMs(data.summary.webVitals.tti), formatMs(data.baseline.tti));
    
    addSectionDivider();
  }

  // Regression Alerts
  if (data.alerts.length > 0) {
    checkPageBreak(40);
    addTitle('Regression Alerts');
    y += 5;
    
    const criticalAlerts = data.alerts.filter(a => a.severity === 'critical');
    const warningAlerts = data.alerts.filter(a => a.severity === 'warning');
    
    if (criticalAlerts.length > 0) {
      doc.setTextColor(220, 38, 38);
      addText(`Critical (${criticalAlerts.length}):`);
      doc.setTextColor(0, 0, 0);
      
      criticalAlerts.forEach(alert => {
        checkPageBreak(8);
        const formatValue = (v: number) => alert.metric === 'Memory Usage' ? formatMB(v) : formatMs(v);
        addText(`  • ${alert.metric}: ${formatValue(alert.baseline)} → ${formatValue(alert.current)} (+${alert.degradation.toFixed(1)}%)`);
      });
      y += 3;
    }
    
    if (warningAlerts.length > 0) {
      doc.setTextColor(217, 119, 6);
      addText(`Warnings (${warningAlerts.length}):`);
      doc.setTextColor(0, 0, 0);
      
      warningAlerts.forEach(alert => {
        checkPageBreak(8);
        const formatValue = (v: number) => alert.metric === 'Memory Usage' ? formatMB(v) : formatMs(v);
        addText(`  • ${alert.metric}: ${formatValue(alert.baseline)} → ${formatValue(alert.current)} (+${alert.degradation.toFixed(1)}%)`);
      });
    }
    
    addSectionDivider();
  }

  // Budget Violations
  if (data.summary.budgetViolations.length > 0) {
    checkPageBreak(40);
    addTitle('Budget Violations');
    y += 5;
    
    data.summary.budgetViolations.slice(-10).forEach(violation => {
      checkPageBreak(8);
      addText(`• ${violation.metric.name}: exceeded by ${violation.exceeded.toFixed(1)}ms (budget: ${violation.budget}ms)`);
    });
    
    if (data.summary.budgetViolations.length > 10) {
      addText(`... and ${data.summary.budgetViolations.length - 10} more`);
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated by Performance Monitoring System',
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc;
};

export const downloadPerformanceReportPdf = (data: PerformanceReportData): void => {
  const doc = generatePerformanceReportPdf(data);
  const filename = `performance-report-${data.generatedAt.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

import axe, { AxeResults, Result } from 'axe-core';

export interface AuditResult {
  violations: Result[];
  passes: Result[];
  incomplete: Result[];
  inapplicable: Result[];
  timestamp: string;
  url: string;
  wcagLevel: string;
}

export interface ViolationSummary {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
  wcagTags: string[];
}

/**
 * Run axe-core accessibility audit on the current page
 * Configured for WCAG 2.1 AA compliance
 */
export async function runAccessibilityAudit(
  context: Document | Element = document
): Promise<AuditResult> {
  const results: AxeResults = await axe.run(context, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
    resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
  });

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
    inapplicable: results.inapplicable,
    timestamp: results.timestamp,
    url: results.url,
    wcagLevel: 'WCAG 2.1 AA',
  };
}

/**
 * Get a summary of violations for logging/display
 */
export function getViolationSummary(results: AuditResult): ViolationSummary[] {
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact || 'unknown',
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.length,
    wcagTags: violation.tags.filter(
      (tag) => tag.startsWith('wcag') || tag.startsWith('best-practice')
    ),
  }));
}

/**
 * Format audit results for console output
 */
export function formatAuditReport(results: AuditResult): string {
  const violations = getViolationSummary(results);
  
  let report = `\n═══════════════════════════════════════════════════════════\n`;
  report += `  ACCESSIBILITY AUDIT REPORT - ${results.wcagLevel}\n`;
  report += `  URL: ${results.url}\n`;
  report += `  Timestamp: ${results.timestamp}\n`;
  report += `═══════════════════════════════════════════════════════════\n\n`;

  report += `📊 SUMMARY\n`;
  report += `───────────────────────────────────────────────────────────\n`;
  report += `  ✓ Passed: ${results.passes.length} rules\n`;
  report += `  ✗ Violations: ${results.violations.length} rules\n`;
  report += `  ⚠ Incomplete: ${results.incomplete.length} rules (manual review needed)\n`;
  report += `  ○ Inapplicable: ${results.inapplicable.length} rules\n\n`;

  if (violations.length === 0) {
    report += `🎉 No accessibility violations detected!\n`;
    report += `   Your page meets WCAG 2.1 AA standards.\n\n`;
  } else {
    report += `❌ VIOLATIONS (${violations.length})\n`;
    report += `───────────────────────────────────────────────────────────\n`;
    
    // Group by impact
    const critical = violations.filter((v) => v.impact === 'critical');
    const serious = violations.filter((v) => v.impact === 'serious');
    const moderate = violations.filter((v) => v.impact === 'moderate');
    const minor = violations.filter((v) => v.impact === 'minor');

    const formatViolation = (v: ViolationSummary, index: number) => {
      return `  ${index + 1}. [${v.impact?.toUpperCase()}] ${v.id}\n` +
        `     ${v.help}\n` +
        `     Affected elements: ${v.nodes}\n` +
        `     WCAG: ${v.wcagTags.join(', ')}\n` +
        `     More info: ${v.helpUrl}\n\n`;
    };

    if (critical.length > 0) {
      report += `\n  🔴 CRITICAL (${critical.length})\n`;
      critical.forEach((v, i) => {
        report += formatViolation(v, i);
      });
    }

    if (serious.length > 0) {
      report += `\n  🟠 SERIOUS (${serious.length})\n`;
      serious.forEach((v, i) => {
        report += formatViolation(v, i);
      });
    }

    if (moderate.length > 0) {
      report += `\n  🟡 MODERATE (${moderate.length})\n`;
      moderate.forEach((v, i) => {
        report += formatViolation(v, i);
      });
    }

    if (minor.length > 0) {
      report += `\n  🟢 MINOR (${minor.length})\n`;
      minor.forEach((v, i) => {
        report += formatViolation(v, i);
      });
    }
  }

  if (results.incomplete.length > 0) {
    report += `\n⚠️ NEEDS MANUAL REVIEW (${results.incomplete.length})\n`;
    report += `───────────────────────────────────────────────────────────\n`;
    results.incomplete.slice(0, 5).forEach((item, i) => {
      report += `  ${i + 1}. ${item.id}: ${item.help}\n`;
    });
    if (results.incomplete.length > 5) {
      report += `  ... and ${results.incomplete.length - 5} more\n`;
    }
  }

  report += `\n═══════════════════════════════════════════════════════════\n`;
  
  return report;
}

/**
 * Run audit and log results to console
 */
export async function auditAndLog(
  context: Document | Element = document
): Promise<AuditResult> {
  console.log('🔍 Running accessibility audit...');
  const results = await runAccessibilityAudit(context);
  console.log(formatAuditReport(results));
  return results;
}

/**
 * Check if page passes WCAG 2.1 AA (no critical or serious violations)
 */
export function passesWCAG21AA(results: AuditResult): boolean {
  const criticalOrSerious = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );
  return criticalOrSerious.length === 0;
}

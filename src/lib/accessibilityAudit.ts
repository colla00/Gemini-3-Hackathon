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

/**
 * Get accessibility score (0-100)
 */
export function getAccessibilityScore(results: AuditResult): number {
  const total = results.violations.length + results.passes.length;
  if (total === 0) return 100;
  
  // Weight violations by impact
  const violationWeight = results.violations.reduce((acc, v) => {
    switch (v.impact) {
      case 'critical': return acc + 4;
      case 'serious': return acc + 3;
      case 'moderate': return acc + 2;
      case 'minor': return acc + 1;
      default: return acc + 1;
    }
  }, 0);
  
  const passWeight = results.passes.length;
  const maxViolationWeight = results.violations.length * 4;
  
  if (maxViolationWeight === 0) return 100;
  
  const score = Math.round(
    ((passWeight / (passWeight + violationWeight)) * 100)
  );
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get compliance summary for quick display
 */
export function getComplianceSummary(results: AuditResult): {
  level: 'pass' | 'warning' | 'fail';
  score: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  passCount: number;
  incompleteCount: number;
} {
  const critical = results.violations.filter((v) => v.impact === 'critical').length;
  const serious = results.violations.filter((v) => v.impact === 'serious').length;
  const moderate = results.violations.filter((v) => v.impact === 'moderate').length;
  const minor = results.violations.filter((v) => v.impact === 'minor').length;
  
  let level: 'pass' | 'warning' | 'fail' = 'pass';
  if (critical > 0 || serious > 0) {
    level = 'fail';
  } else if (moderate > 0 || minor > 0 || results.incomplete.length > 0) {
    level = 'warning';
  }
  
  return {
    level,
    score: getAccessibilityScore(results),
    criticalCount: critical,
    seriousCount: serious,
    moderateCount: moderate,
    minorCount: minor,
    passCount: results.passes.length,
    incompleteCount: results.incomplete.length,
  };
}

/**
 * Check specific accessibility features
 */
export interface FeatureCheck {
  name: string;
  passed: boolean;
  details: string;
}

export function checkAccessibilityFeatures(element: Element = document.body): FeatureCheck[] {
  const checks: FeatureCheck[] = [];
  
  // Check for skip links
  const skipLinks = element.querySelectorAll('a[href^="#"]');
  const hasSkipLink = Array.from(skipLinks).some(
    (link) => link.textContent?.toLowerCase().includes('skip')
  );
  checks.push({
    name: 'Skip Links',
    passed: hasSkipLink,
    details: hasSkipLink 
      ? 'Skip link found for keyboard navigation' 
      : 'No skip link detected - add for keyboard users',
  });
  
  // Check for main landmark
  const hasMain = element.querySelector('main, [role="main"]') !== null;
  checks.push({
    name: 'Main Landmark',
    passed: hasMain,
    details: hasMain 
      ? 'Main content landmark present' 
      : 'Missing <main> or role="main" landmark',
  });
  
  // Check for heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const hasH1 = element.querySelector('h1') !== null;
  checks.push({
    name: 'Heading Structure',
    passed: hasH1 && headings.length > 0,
    details: hasH1 
      ? `${headings.length} headings found with H1` 
      : 'Missing H1 heading',
  });
  
  // Check for alt text on images
  const images = element.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(
    (img) => img.hasAttribute('alt')
  );
  const allImagesHaveAlt = images.length === 0 || imagesWithAlt.length === images.length;
  checks.push({
    name: 'Image Alt Text',
    passed: allImagesHaveAlt,
    details: allImagesHaveAlt 
      ? `All ${images.length} images have alt attributes` 
      : `${images.length - imagesWithAlt.length} of ${images.length} images missing alt`,
  });
  
  // Check for form labels
  const inputs = element.querySelectorAll('input, select, textarea');
  const inputsWithLabels = Array.from(inputs).filter((input) => {
    const id = input.getAttribute('id');
    const hasLabel = id ? element.querySelector(`label[for="${id}"]`) !== null : false;
    const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
    const hasPlaceholder = input.hasAttribute('placeholder');
    return hasLabel || hasAriaLabel || hasPlaceholder;
  });
  const allInputsLabeled = inputs.length === 0 || inputsWithLabels.length === inputs.length;
  checks.push({
    name: 'Form Labels',
    passed: allInputsLabeled,
    details: allInputsLabeled 
      ? `All ${inputs.length} form inputs are labeled` 
      : `${inputs.length - inputsWithLabels.length} of ${inputs.length} inputs missing labels`,
  });
  
  // Check for focusable elements
  const focusable = element.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  checks.push({
    name: 'Keyboard Focusable',
    passed: focusable.length > 0,
    details: `${focusable.length} focusable elements found`,
  });
  
  // Check for ARIA landmarks
  const landmarks = element.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], ' +
    'header, nav, main, footer, aside, section[aria-label], section[aria-labelledby]'
  );
  checks.push({
    name: 'ARIA Landmarks',
    passed: landmarks.length >= 2,
    details: `${landmarks.length} landmarks found`,
  });
  
  // Check for color contrast indicators (buttons with visible text)
  const buttons = element.querySelectorAll('button');
  const buttonsWithText = Array.from(buttons).filter(
    (btn) => btn.textContent?.trim() || btn.getAttribute('aria-label')
  );
  checks.push({
    name: 'Button Accessibility',
    passed: buttonsWithText.length === buttons.length,
    details: `${buttonsWithText.length} of ${buttons.length} buttons have accessible names`,
  });
  
  return checks;
}

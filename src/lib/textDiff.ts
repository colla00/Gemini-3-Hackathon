/**
 * Simple line-based diff algorithm (Myers-like via LCS).
 * Returns an array of diff lines with type: 'same' | 'added' | 'removed'.
 */

export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  content: string;
  lineNumber?: number;
}

/** Compute longest common subsequence table */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/** Generate a line-based diff between two strings */
export function diffLines(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // For very large content, truncate to first 500 lines each
  const maxLines = 500;
  const a = oldLines.slice(0, maxLines);
  const b = newLines.slice(0, maxLines);

  const dp = lcsTable(a, b);
  const result: DiffLine[] = [];

  let i = a.length;
  let j = b.length;

  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: 'same', content: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', content: b[j - 1] });
      j--;
    } else {
      stack.push({ type: 'removed', content: a[i - 1] });
      i--;
    }
  }

  stack.reverse();
  
  // Add line numbers
  let oldLine = 1;
  let newLine = 1;
  for (const line of stack) {
    if (line.type === 'removed') {
      line.lineNumber = oldLine++;
    } else if (line.type === 'added') {
      line.lineNumber = newLine++;
    } else {
      line.lineNumber = newLine++;
      oldLine++;
    }
    result.push(line);
  }

  // Indicate truncation
  if (oldLines.length > maxLines || newLines.length > maxLines) {
    result.push({ type: 'same', content: `... (truncated — showing first ${maxLines} lines)` });
  }

  return result;
}

/** Summary stats for a diff */
export function diffStats(lines: DiffLine[]) {
  const added = lines.filter(l => l.type === 'added').length;
  const removed = lines.filter(l => l.type === 'removed').length;
  const unchanged = lines.filter(l => l.type === 'same').length;
  return { added, removed, unchanged, total: lines.length };
}

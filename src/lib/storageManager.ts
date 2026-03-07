/**
 * Storage Manager with TTL expiration and automatic cleanup.
 * Wraps localStorage items with metadata for expiry tracking.
 */

interface StorageEntry<T = unknown> {
  value: T;
  expiresAt: number | null; // Unix timestamp in ms, null = no expiry
  createdAt: number;
}

// TTL durations in milliseconds
const TTL = {
  SHORT: 1000 * 60 * 30,         // 30 minutes
  MEDIUM: 1000 * 60 * 60 * 24,   // 24 hours
  LONG: 1000 * 60 * 60 * 24 * 7, // 7 days
  MONTH: 1000 * 60 * 60 * 24 * 30,// 30 days
} as const;

// Registry of managed keys and their default TTLs
const KEY_REGISTRY: Record<string, number | null> = {
  // Session-scoped (30 min)
  'presentation_session_id': TTL.SHORT,
  'presenter_sync_state': TTL.SHORT,
  
  // Day-scoped (24 hours)
  'demo_auth_email': TTL.MEDIUM,
  'lighthouse_history': TTL.MEDIUM,
  'lighthouse_prod_history': TTL.MEDIUM,
  'perf_regression_baseline': TTL.MEDIUM,
  
  // User preference (7 days)
  'nso_remember_email': TTL.LONG,
  'nso_session_history': TTL.LONG,
  'nso_guided_tour_completed': TTL.LONG,
  
  // Long-lived (30 days)
  'cookie_consent': TTL.MONTH,
  'cookie_preferences': TTL.MONTH,
  'vitasignal_settings': TTL.MONTH,
};

const MANAGED_PREFIX = '__sm_'; // prefix for managed wrapper entries

function getManagedKey(key: string): string {
  return `${MANAGED_PREFIX}${key}`;
}

/**
 * Set a localStorage item with optional TTL.
 * If the key is in the registry, its default TTL is used unless overridden.
 */
export function setWithExpiry(key: string, value: unknown, ttlMs?: number | null): void {
  const ttl = ttlMs !== undefined ? ttlMs : (KEY_REGISTRY[key] ?? null);
  const entry: StorageEntry = {
    value,
    expiresAt: ttl ? Date.now() + ttl : null,
    createdAt: Date.now(),
  };
  try {
    localStorage.setItem(getManagedKey(key), JSON.stringify(entry));
    // Also write the raw value for backward compatibility
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) {
    console.warn(`[StorageManager] Failed to write key "${key}":`, e);
  }
}

/**
 * Get a localStorage item, returning null if expired.
 * Automatically cleans up expired entries.
 */
export function getWithExpiry<T = string>(key: string): T | null {
  try {
    const managed = localStorage.getItem(getManagedKey(key));
    if (managed) {
      const entry: StorageEntry<T> = JSON.parse(managed);
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        // Expired — clean up
        removeManaged(key);
        return null;
      }
      return entry.value;
    }
    // Fallback: read raw value for unmanaged/legacy keys
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  } catch {
    return null;
  }
}

/**
 * Remove a managed key and its raw counterpart.
 */
export function removeManaged(key: string): void {
  localStorage.removeItem(getManagedKey(key));
  localStorage.removeItem(key);
}

/**
 * Scan all managed keys and remove expired entries.
 * Call on app startup or periodically.
 */
export function cleanupExpired(): number {
  let cleaned = 0;
  try {
    const keysToCheck: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(MANAGED_PREFIX)) {
        keysToCheck.push(k);
      }
    }
    for (const managedKey of keysToCheck) {
      try {
        const raw = localStorage.getItem(managedKey);
        if (!raw) continue;
        const entry: StorageEntry = JSON.parse(raw);
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          const originalKey = managedKey.slice(MANAGED_PREFIX.length);
          localStorage.removeItem(managedKey);
          localStorage.removeItem(originalKey);
          cleaned++;
        }
      } catch {
        // Corrupted entry — remove it
        localStorage.removeItem(managedKey);
        cleaned++;
      }
    }
  } catch (e) {
    console.warn('[StorageManager] Cleanup error:', e);
  }
  return cleaned;
}

/**
 * Migrate existing raw localStorage keys to managed entries with TTLs.
 * Only migrates keys that exist but don't have a managed wrapper yet.
 */
export function migrateExistingKeys(): void {
  for (const [key, ttl] of Object.entries(KEY_REGISTRY)) {
    const managed = localStorage.getItem(getManagedKey(key));
    if (managed) continue; // Already managed

    const raw = localStorage.getItem(key);
    if (raw === null) continue; // Doesn't exist

    // Wrap existing value with TTL
    const entry: StorageEntry = {
      value: (() => { try { return JSON.parse(raw); } catch { return raw; } })(),
      expiresAt: ttl ? Date.now() + ttl : null,
      createdAt: Date.now(),
    };
    try {
      localStorage.setItem(getManagedKey(key), JSON.stringify(entry));
    } catch {
      // Storage full — skip
    }
  }
}

/**
 * Initialize storage manager: migrate legacy keys and clean up expired entries.
 */
export function initStorageManager(): void {
  migrateExistingKeys();
  const cleaned = cleanupExpired();
  if (cleaned > 0) {
    console.info(`[StorageManager] Cleaned ${cleaned} expired entries`);
  }
}

export { TTL, KEY_REGISTRY };

/**
 * JsonBin.io cloud storage helper for BG Payment Tracker
 * Provides functions to load and save tracker state to JsonBin
 */

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const MASTER_KEY = import.meta.env.VITE_JSONBIN_MASTER_KEY;

export interface TrackerState {
  invoices: any[];
  bgs: any[];
  paymentHistory: any[];
  lastUpdated: number;
}

/**
 * Create a new bin in JsonBin for tracker data
 */
export async function createTrackerBin(initialData: TrackerState): Promise<string> {
  if (!MASTER_KEY) {
    throw new Error('JsonBin Master Key not configured');
  }

  const response = await fetch(`${JSONBIN_API_URL}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY,
    },
    body: JSON.stringify(initialData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create JsonBin: ${response.statusText}`);
  }

  const data = await response.json();
  return data.metadata.id; // Return the bin ID
}

/**
 * Load tracker state from JsonBin
 */
export async function loadTrackerState(binId: string): Promise<TrackerState> {
  if (!MASTER_KEY) {
    throw new Error('JsonBin Master Key not configured');
  }

  const response = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
    method: 'GET',
    headers: {
      'X-Master-Key': MASTER_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load tracker state: ${response.statusText}`);
  }

  const data = await response.json();
  return data.record;
}

/**
 * Save tracker state to JsonBin
 */
export async function saveTrackerState(binId: string, state: TrackerState): Promise<void> {
  if (!MASTER_KEY) {
    throw new Error('JsonBin Master Key not configured');
  }

  const response = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY,
    },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    throw new Error(`Failed to save tracker state: ${response.statusText}`);
  }
}

/**
 * Get or create tracker bin ID from localStorage
 */
export function getOrCreateBinId(): string {
  let binId = localStorage.getItem('tracker_bin_id');
  if (!binId) {
    binId = `tracker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('tracker_bin_id', binId);
  }
  return binId;
}

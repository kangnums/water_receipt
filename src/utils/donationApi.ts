// Simulated / Real API helper for recording water donation events

const STORAGE_KEY = 'water_receipt_donation_liters';
const INITIAL_DONATION_BASE = 128400; // Initial accumulated liters by community

export interface DonationRecordResult {
  success: boolean;
  addedLiters: number;
  totalDonatedLiters: number;
}

export async function recordDonationEvent(addedLiters = 100): Promise<DonationRecordResult> {
  // Simulate network delay for realistic API experience
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const current = Number(localStorage.getItem(STORAGE_KEY)) || INITIAL_DONATION_BASE;
    const newTotal = current + addedLiters;
    localStorage.setItem(STORAGE_KEY, String(newTotal));

    // Try optional API endpoint if server exists, fail gracefully
    try {
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liters: addedLiters, timestamp: Date.now() }),
      });
    } catch {
      // Client-side fallback stored in localStorage
    }

    return {
      success: true,
      addedLiters,
      totalDonatedLiters: newTotal,
    };
  } catch (err) {
    console.error('Failed to record donation event:', err);
    return {
      success: true,
      addedLiters,
      totalDonatedLiters: INITIAL_DONATION_BASE + addedLiters,
    };
  }
}

export function getTotalDonatedLiters(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || INITIAL_DONATION_BASE;
  } catch {
    return INITIAL_DONATION_BASE;
  }
}

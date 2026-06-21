import { AD_TIMEOUT_MS } from '../constants';
import type { AdOutcome } from '../types';

export function showInterstitial(): Promise<AdOutcome> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve('timeout');
    }, AD_TIMEOUT_MS);

    // Placeholder: Adsterra integration would go here
    // For now, simulate ad completion after 1.5s
    setTimeout(() => {
      clearTimeout(timeout);
      resolve('completed');
    }, 1500);
  });
}

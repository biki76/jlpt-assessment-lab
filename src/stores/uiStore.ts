import { create } from 'zustand';

interface UIStoreState {
  isOffline: boolean;
  isScoringLoading: boolean;
  showConsentBanner: boolean;
  consentStatus: 'accepted' | 'declined' | 'undecided';
}

interface UIStoreActions {
  setOffline: (offline: boolean) => void;
  setScoringLoading: (loading: boolean) => void;
  setConsentBanner: (show: boolean) => void;
  setConsentStatus: (status: 'accepted' | 'declined' | 'undecided') => void;
}

export const useUIStore = create<UIStoreState & UIStoreActions>((set) => ({
  isOffline: false,
  isScoringLoading: false,
  showConsentBanner: false,
  consentStatus: 'undecided',

  setOffline: (offline: boolean) => set({ isOffline: offline }),
  setScoringLoading: (loading: boolean) => set({ isScoringLoading: loading }),
  setConsentBanner: (show: boolean) => set({ showConsentBanner: show }),
  setConsentStatus: (status: 'accepted' | 'declined' | 'undecided') => set({ consentStatus: status }),
}));

import { create } from 'zustand';
import type { ChapterId } from '../data/chapters';

export type DiaryState = 'closed' | 'opening' | 'open' | 'closing';
export type DeviceTier = 1 | 2 | 3;

interface PortfolioStore {
  // ---- state ----
  diaryState: DiaryState;
  activeChapter: ChapterId | null; // null === the "intro spread" home view
  activeProject: string | null; // 'ai-invoice-studio' | 'whatsapp-bot' | 'echo'
  deviceTier: DeviceTier;
  reducedMotion: boolean;
  threeDEnabled: boolean; // false => Layer B only, no Canvas mounted
  isMobile: boolean;

  // ---- actions (bridge used by BOTH layers) ----
  openDiary: () => void;
  closeDiary: () => void;
  goToChapter: (c: ChapterId) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  setDeviceTier: (t: DeviceTier) => void;
  setReducedMotion: (v: boolean) => void;
  setThreeDEnabled: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;

  // ---- internal: the CameraRig finalizes the physical open/close here ----
  _setDiaryState: (s: DiaryState) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  diaryState: 'closed',
  activeChapter: null,
  activeProject: null,
  deviceTier: 3,
  reducedMotion: false,
  threeDEnabled: false,
  isMobile: false,

  openDiary: () => {
    if (get().diaryState !== 'closed') return;
    // Prepare the intro spread (home) immediately so Layer B can fade in as the
    // cover swings. The rig flips diaryState -> 'open' when the camera settles.
    set({ diaryState: 'opening', activeChapter: null, activeProject: null });
  },

  closeDiary: () => {
    if (get().diaryState !== 'open') return;
    set({ diaryState: 'closing', activeChapter: null, activeProject: null });
  },

  goToChapter: (c) => {
    if (get().diaryState !== 'open') return;
    set({ activeChapter: c, activeProject: null });
  },

  openProject: (id) => {
    if (get().diaryState !== 'open') return;
    set({ activeProject: id });
  },

  closeProject: () => set({ activeProject: null }),

  setDeviceTier: (t) => set({ deviceTier: t }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setThreeDEnabled: (v) => set({ threeDEnabled: v }),
  setIsMobile: (v) => set({ isMobile: v }),

  _setDiaryState: (s) => set({ diaryState: s }),
}));

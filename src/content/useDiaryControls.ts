import { useCallback } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';

// Begin/close that works for BOTH paths:
//  - 3D enabled: openDiary()/closeDiary() hand off to the CameraRig's GSAP timeline.
//  - 3D disabled (tier 1 / no WebGL / reduced-motion): jump straight to the
//    resting state, since there is no rig to finalize the transition.
export function useDiaryControls() {
  const begin = useCallback(() => {
    const s = usePortfolioStore.getState();
    if (s.threeDEnabled) {
      s.openDiary();
    } else {
      s._setDiaryState('open');
      usePortfolioStore.setState({ activeChapter: null, activeProject: null });
    }
  }, []);

  const close = useCallback(() => {
    const s = usePortfolioStore.getState();
    if (s.threeDEnabled) s.closeDiary();
    else {
      s._setDiaryState('closed');
      s.activeChapter = null;
      s.activeProject = null;
    }
  }, []);

  return { begin, close };
}

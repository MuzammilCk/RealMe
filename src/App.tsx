import { lazy, Suspense, useEffect, useState } from 'react';
import { usePortfolioStore } from './store/usePortfolioStore';
import { detectDevice } from './lib/deviceTier';
import { readUrl, writeUrl } from './lib/urlSync';
import Overlay from './content/Overlay';
import LoadingScreen from './content/LoadingScreen';
import CanvasErrorBoundary from './scene/CanvasErrorBoundary';
import { useDiaryControls } from './content/useDiaryControls';
import AppLayout from './app/layout';
import { useKonamiCode } from './ui/hooks/useEasterEggs';

// Layer A is code-split: three.js / R3F only download when 3D is enabled, so
// the tier-1 / no-WebGL / reduced-motion fallback (Layer B only) stays light.
const CanvasRoot = lazy(() => import('./scene/CanvasRoot'));

export default function App() {
  const threeDEnabled = usePortfolioStore((s) => s.threeDEnabled);
  const setThreeDEnabled = usePortfolioStore((s) => s.setThreeDEnabled);
  const [loading, setLoading] = useState(true);
  const { close } = useDiaryControls();

  // Konami code easter egg - triggers mystery mode
  useKonamiCode(() => {
    // Toggle mystery mode - could change theme, enable special effects, etc.
    console.log('✦ Konami code activated — Mystery mode engaged');
    // Could trigger: themeProvider.toggleTheme(), particle burst, etc.
  });

  // --- boot: device detection, deep-link seed, minimum loading veil ---
  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setLoading(false);
    };
    // Hard safety: the loader must never get stuck, no matter what.
    const safety = window.setTimeout(finish, 2500);
    // Extra safety: force dismiss after 5s even if boot hangs
    const forceFinish = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    (async () => {
      try {
        const profile = await detectDevice();
        if (cancelled) return;
        usePortfolioStore.getState().setDeviceTier(profile.tier);
        usePortfolioStore.getState().setReducedMotion(profile.reducedMotion);
        usePortfolioStore.getState().setThreeDEnabled(profile.threeDEnabled);
        // Detect mobile
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        usePortfolioStore.getState().setIsMobile(isMobile);

        // deep link: ?chapter=projects&project=ai-invoice-studio
        const { chapter, project } = readUrl();
        if (chapter || project) {
          if (profile.threeDEnabled) {
            usePortfolioStore.setState({ diaryState: 'opening', activeChapter: chapter, activeProject: project });
          } else {
            usePortfolioStore.setState({ diaryState: 'open', activeChapter: chapter, activeProject: project });
          }
        }
      } catch {
        // boot failure => Layer B only (threeDEnabled stays false)
      } finally {
        // keep the veil up briefly for a smooth reveal, then hide
        window.setTimeout(finish, 450);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      window.clearTimeout(forceFinish);
    };
  }, []);

  // --- fallback (no 3D): finalize opening/closing instantly, no rig to do it ---
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const _setDiaryState = usePortfolioStore((s) => s._setDiaryState);
  useEffect(() => {
    if (!threeDEnabled) {
      if (diaryState === 'opening') _setDiaryState('open');
      else if (diaryState === 'closing') _setDiaryState('closed');
    }
  }, [threeDEnabled, diaryState, _setDiaryState]);

  // --- URL sync: mirror activeChapter / activeProject to query params ---
  useEffect(() => {
    const unsub = usePortfolioStore.subscribe((s) => writeUrl(s.activeChapter, s.activeProject));
    return unsub;
  }, []);

  // --- Escape closes the diary ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const s = usePortfolioStore.getState();
      if (s.diaryState === 'open' || s.diaryState === 'opening') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <>
      {threeDEnabled && (
        <CanvasErrorBoundary onError={() => setThreeDEnabled(false)}>
          <Suspense fallback={null}>
            <CanvasRoot />
          </Suspense>
        </CanvasErrorBoundary>
      )}
      <AppLayout />
      <Overlay />
      <LoadingScreen done={!loading} />
    </>
  );
}

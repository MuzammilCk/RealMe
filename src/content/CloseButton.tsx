import { useDiaryControls } from './useDiaryControls';

// Close affordance (top-right). Returns to the intro/closed state.
export default function CloseButton() {
  const { close } = useDiaryControls();
  return (
    <button
      type="button"
      onClick={close}
      className="absolute right-7 top-6 rounded-full border border-brass/40 bg-black/30 px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] text-parchment transition-colors hover:border-brass hover:text-brass"
      aria-label="Close the diary"
    >
      close ✕
    </button>
  );
}

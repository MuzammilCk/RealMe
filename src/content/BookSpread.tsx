import type { ReactNode } from 'react';

// The two-page parchment spread. Used by the intro spread AND every chapter so
// the "reading a page" feeling holds throughout. Stacks to one column on mobile.
export default function BookSpread({
  left,
  right,
  labelled = true,
}: {
  left: ReactNode;
  right: ReactNode;
  labelled?: boolean;
}) {
  return (
    <div
      className="grid w-full max-w-[920px] grid-cols-1 overflow-hidden rounded-[3px] shadow-[var(--shadow-spread)] md:grid-cols-2 md:max-h-[80vh]"
      style={{
        background:
          'linear-gradient(180deg, rgba(237,224,200,0.98), rgba(228,212,184,0.98))',
      }}
      role={labelled ? 'region' : undefined}
      aria-label={labelled ? 'Diary spread' : undefined}
    >
      <div className="page-scroll overflow-y-auto p-8 sm:p-10 md:border-r md:border-leather/10">
        {left}
      </div>
      <div className="page-scroll overflow-y-auto p-8 sm:p-10">{right}</div>
    </div>
  );
}

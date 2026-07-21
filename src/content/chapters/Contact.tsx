import { CONTACT } from '../../data/chapters';
import BookSpread from '../BookSpread';

// Chapter 05 — Contact, styled as a closing letter (not a form).
export default function Contact() {
  const mailto = `mailto:${CONTACT.email}`;
  const links = [
    { label: CONTACT.email, href: mailto },
    { label: CONTACT.github, href: `https://${CONTACT.github}` },
    { label: CONTACT.linkedin, href: `https://${CONTACT.linkedin}` },
  ];

  const left = (
    <>
      <p className="eyebrow-mini">{CONTACT.eyebrow}</p>
      <p className="body-copy">{CONTACT.lead}</p>
    </>
  );
  const right = (
    <>
      <div className="flex flex-col gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="font-mono text-sm text-[#7a4a1e] underline-offset-4 transition-colors hover:text-leather hover:underline"
            target={l.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer noopener"
          >
            {l.label}
          </a>
        ))}
      </div>
      <a href={mailto} className="cta mt-6">
        {CONTACT.cta}
      </a>
    </>
  );

  return <BookSpread left={left} right={right} />;
}

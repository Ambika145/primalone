import { useState } from 'react';
import Icon from '../ui/Icon.jsx';
import { Button, Reveal } from '../ui/primitives.jsx';
import './Inner.css';

// Shared building blocks for the inner pages. Each page composes its own layout from these
// plus page-specific sections; only the pieces that genuinely repeat live here.

// Accordion: one row per question. `tone="dark"` for night sections.
export function Accordion({ items, tone = 'light', first = true }) {
  const [open, setOpen] = useState(first ? 0 : -1);
  return (
    <ul className={`x-acc x-acc--${tone}`}>
      {items.map((it, i) => {
        const on = open === i;
        const id = `acc-${it.q.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
        return (
          <li key={it.q} className={on ? 'is-open' : ''}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? -1 : i)}>
                <span>{it.q}</span>
                <span className="x-acc__icon" aria-hidden="true"><Icon name="plus" size={18} /></span>
              </button>
            </h3>
            <div id={id} className="x-acc__a" role="region" aria-label={it.q}>
              <div><p>{it.a}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Closing call to action: a rounded band with a photo on one side.
export function PageCta({ title, body, image, tone = 'night', actions }) {
  return (
    <section className="x-sec x-sec--tight">
      <div className="shell">
        <Reveal className={`x-cta x-cta--${tone} ${tone === 'night' ? 'on-night' : ''}`}>
          <div className="x-cta__copy">
            <h2 className="x-h2">{title}</h2>
            {body && <p className="x-lead">{body}</p>}
            <div className="x-cta__actions">
              {actions.map((a, i) => (
                <Button key={a.href} href={a.href} variant={i === 0 ? (tone === 'night' ? 'light' : 'dark') : (tone === 'night' ? 'outline-light' : 'outline')} arrow={i === 0}>
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
          {image && (
            <div className="x-cta__media" aria-hidden="true">
              <img src={`/img/${image}-1080.webp`} alt="" loading="lazy" decoding="async" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// Section heading: one-line title, description below (no eyebrow labels)
export function SecHead({ title, accent, lead, center = false, tone }) {
  return (
    <Reveal className={`x-head ${center ? 'x-head--center' : ''} ${tone === 'dark' ? 'x-head--dark' : ''}`}>
      <h2 className="x-h2">{title}{accent && <> <span className="is-accent">{accent}</span></>}</h2>
      {lead && <p className="x-lead">{lead}</p>}
    </Reveal>
  );
}

// Reading time from word count, at ~200 words a minute
export const readTime = (paras) => Math.max(1, Math.round(paras.join(' ').split(/\s+/).length / 200));

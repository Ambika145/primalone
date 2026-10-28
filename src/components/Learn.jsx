import { useLayoutEffect, useRef, useState } from 'react';
import { learn } from '../data/content.js';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import { SplitLines } from './ui/primitives.jsx';
import './Learn.css';

// The three reads take turns: the active one is in focus, its title gets a marker
// highlight, the line fills down to it and the bottle tilts. A ring around the active
// dot fills over a few seconds; when it completes, the next read takes over.
// Hovering, focusing or tapping a read picks it (and the ring pauses while hovered).
export default function Learn() {
  const [sectionRef, inView] = useInView({ threshold: 0.22 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);
  const listRef = useRef(null);

  // Line fill reaches the active dot, wherever the text wrapping puts it
  useLayoutEffect(() => {
    const measure = () => {
      const li = listRef.current?.querySelectorAll('.learn__step')[active];
      if (li) setFill(li.offsetTop + li.querySelector('.learn__node').offsetTop + 8);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  const next = () => setActive((a) => (a + 1) % learn.reads.length);

  return (
    <section
      id="learn"
      ref={sectionRef}
      className={`section learn ${inView ? 'is-in' : ''} ${reduced ? '' : 'is-reading'}`}
      aria-labelledby="learn-title"
      style={{ '--fill': `${fill}px` }}
      data-read={active}
    >
      <div className="shell learn__shell">
        <figure className="learn__visual">
          <div className="learn__glow" aria-hidden="true" />
          <img
            className="learn__bottle"
            src={`/img/${learn.image.name}.webp`}
            alt={learn.image.alt}
            width={900}
            height={1200}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="learn__side">
          <div className="learn__intro">
            <SplitLines id="learn-title" className="h-lg learn__title" lines={learn.titleLines} accentLast />
            <p className="learn__lead">{learn.lead}</p>
          </div>

          <ol className="learn__timeline" ref={listRef}>
            {learn.reads.map((r, i) => (
              <li
                key={r.n}
                className={`learn__step ${i === active ? 'is-active' : ''}`}
                style={{ '--i': i }}
                tabIndex={0}
                aria-current={i === active ? 'step' : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span
                  className="learn__node"
                  aria-hidden="true"
                  onAnimationEnd={(e) => e.animationName === 'learn-ring' && next()}
                />
                <div className="learn__step-body">
                  <span className="learn__badge">{r.topic}</span>
                  <h3 className="learn__step-title"><span className="learn__mark">{r.title}</span></h3>
                  <p className="learn__step-copy">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

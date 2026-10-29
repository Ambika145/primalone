import { useEffect, useRef, useState } from 'react';
import { benefits } from '../data/content.js';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import { SafetyNote, SplitLines } from './ui/primitives.jsx';
import './Benefits.css';

export default function Benefits() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const videoRef = useRef(null);
  const [mediaRef, inView] = useInView({ threshold: 0.35, once: false });
  const reduced = useReducedMotion();
  const tab = benefits.tabs[active];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    if (inView) {
      const play = v.play();
      if (play?.catch) play.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, reduced]);

  const onKey = (e) => {
    const n = benefits.tabs.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="benefits" className="benefits" aria-labelledby="benefits-title">
      <div ref={mediaRef} className={`benefits__media ${inView ? 'is-in' : ''}`}>
        <video
          ref={videoRef}
          className="benefits__video"
          src={benefits.video.src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={benefits.video.label}
        />
      </div>

      <div className="benefits__content">
        <div className="benefits__intro">
          <SplitLines id="benefits-title" className="h-lg benefits__title" lines={benefits.titleLines} accentLast />
          <p className="benefits__lead">
            {tab.when} scoop, what it covers.
          </p>
        </div>

        <div className="benefits__switch" role="tablist" aria-label="Choose a product">
          <span className="benefits__switch-thumb" style={{ '--i': active }} aria-hidden="true" />
          {benefits.tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`btab-${t.id}`}
              aria-controls={`bpanel-${t.id}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
            >
              {t.label}
            </button>
          ))}
        </div>

        {benefits.tabs.map((t, i) => (
          <div
            key={t.id}
            id={`bpanel-${t.id}`}
            role="tabpanel"
            aria-labelledby={`btab-${t.id}`}
            hidden={i !== active}
            className="benefits__panel"
          >
            <ul className="benefits__list">
              {t.items.map((item, j) => (
                <li key={item} style={{ '--j': j }}>
                  <span className="benefits__text">{item}</span>
                </li>
              ))}
            </ul>
            {t.safety && <SafetyNote className="benefits__safety" />}
          </div>
        ))}

      </div>
    </section>
  );
}

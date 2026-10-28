import { useEffect, useState } from 'react';
import { signal } from '../data/content.js';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import Icon from './ui/Icon.jsx';
import { Img, Reveal, SplitLines } from './ui/primitives.jsx';
import './EarlySignal.css';

function Stars({ rating = 5 }) {
  return (
    <div className="tcard__stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={15} className={i < rating ? 'is-on' : ''} />
      ))}
    </div>
  );
}

function CountUp({ value }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setN(value); return; }
    let frame, start;
    const tick = (t) => {
      start ??= t;
      const p = Math.min(1, (t - start) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);
  return (
    <strong ref={ref} className="stat__value" aria-label={`${value}%`}>
      <span aria-hidden="true">{n}</span>
      <sup aria-hidden="true">%</sup>
    </strong>
  );
}

export default function EarlySignal() {
  return (
    <section id="signal" className="section signal on-dark" aria-labelledby="signal-title">
      <div className="shell">
        <div className="signal__head">
          <SplitLines id="signal-title" className="h-xl signal__title" lines={signal.titleLines} accentLast />
          <p className="signal__note mono">{signal.note}</p>
        </div>

        <ul className="stats">
          {signal.stats.map((s, i) => (
            <Reveal as="li" key={s.value} delay={i * 120} className="stat">
              <CountUp value={s.value} />
              <p>{s.text}</p>
            </Reveal>
          ))}
        </ul>

        <div className="quotes">
          <ul className="quotes__grid">
            {signal.quotes.map((q, i) => (
              <Reveal as="li" key={q.meta} delay={140 + i * 100} className="tcard">
                <article className="tcard__inner">
                  <div className="tcard__media frame">
                    <Img name={q.image.name} alt={q.image.alt} sizes="(min-width: 992px) 28vw, 80vw" />
                  </div>
                  <div className="tcard__body">
                    <Stars rating={q.rating ?? 5} />
                    <blockquote>
                      <p>{q.text}</p>
                    </blockquote>
                    <footer className="tcard__foot">
                      <span className="tcard__who">{q.who}</span>
                      <span className="tcard__meta mono">{q.meta}</span>
                    </footer>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>

        <p className="fine signal__disc">{signal.disclaimer}</p>
      </div>
    </section>
  );
}

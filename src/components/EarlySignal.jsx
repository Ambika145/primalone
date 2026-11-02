import { useEffect, useRef, useState } from 'react';
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

// One video testimonial: portrait poster, play button, name and stars over the frame.
// Plays the member's clip inline when one is supplied; until then play reveals their quote.
function VideoQuote({ q, i }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);
  const toggle = () => {
    const v = videoRef.current;
    if (v) { if (v.paused) { v.play().catch(() => {}); setOpen(true); } else { v.pause(); setOpen(false); } return; }
    setOpen((o) => !o);
  };
  return (
    <Reveal as="li" delay={140 + i * 100} className={`vquote ${open ? 'is-open' : ''}`}>
      <figure className="vquote__frame">
        {q.video
          ? <video ref={videoRef} className="vquote__media" src={q.video} poster={`/img/${q.poster.name}-640.webp`} playsInline preload="none" onEnded={() => setOpen(false)} />
          : <Img className="vquote__media" name={q.poster.name} alt={q.poster.alt} sizes="(min-width: 992px) 24vw, 70vw" />}
        <button type="button" className="vquote__play" onClick={toggle} aria-pressed={open}
          aria-label={q.video ? `${open ? 'Pause' : 'Play'} video from ${q.who}, ${q.meta}` : `${open ? 'Hide' : 'Read'} the quote from ${q.who}, ${q.meta}`}>
          <Icon name={open ? 'pause' : 'play'} size={22} />
        </button>
        <figcaption className="vquote__cap">
          {!q.video && (
            <blockquote className="vquote__quote"><p>{q.text}</p></blockquote>
          )}
          <Stars rating={q.rating ?? 5} />
          <span className="vquote__who">{q.who}</span>
          <span className="vquote__meta mono">{q.meta}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function VideoQuotes({ quotes }) {
  const rowRef = useRef(null);
  const step = (dir) => {
    const row = rowRef.current;
    const card = row?.querySelector('.vquote');
    if (card) row.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' });
  };
  return (
    <div className="vquotes">
      <ul ref={rowRef} className="vquotes__row">
        {quotes.map((q, i) => <VideoQuote key={q.meta} q={q} i={i} />)}
      </ul>
      <div className="vquotes__nav">
        <button type="button" onClick={() => step(-1)} aria-label="Previous testimonial"><Icon name="arrow" size={18} className="is-flipped" /></button>
        <button type="button" onClick={() => step(1)} aria-label="Next testimonial"><Icon name="arrow" size={18} /></button>
      </div>
    </div>
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

        <VideoQuotes quotes={signal.quotes} />

        <p className="fine signal__disc">{signal.disclaimer}</p>
      </div>
    </section>
  );
}

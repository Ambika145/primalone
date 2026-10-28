import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { why } from '../data/content.js';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import Icon from './ui/Icon.jsx';
import { Img, Reveal } from './ui/primitives.jsx';
import './WhySequence.css';

// "The day, two ways": one day drawn twice, split by a draggable handle.
// The day runs 6:00 → 24:00; x positions are hours mapped across the panel.
const DAY_START = 6, DAY_LEN = 18;
const at = (h) => `${((h - DAY_START) / DAY_LEN) * 100}%`;
const ticks = [6, 9, 12, 15, 18, 21, 24];
const tickLabel = (h) => (h === 12 ? '12 pm' : h === 24 ? '12 am' : h < 12 ? `${h} am` : `${h - 12} pm`);

// Stacked: unlabelled capsules spread over the whole day and piled on top of each other.
// [hour, vertical %, rotation°, tone]
const capsules = [
  [7.2, 34, -18, 'a'], [7.6, 52, 12, 'b'], [8.1, 40, 64, 'c'], [8.4, 62, -8, 'd'], [8.0, 26, 30, 'b'],
  [8.8, 48, -42, 'a'], [9.3, 30, 8, 'd'], [9.1, 66, 22, 'c'], [11.6, 44, -14, 'b'], [12.4, 58, 38, 'a'],
  [12.9, 36, -30, 'c'], [13.3, 50, 6, 'd'], [13.0, 68, -50, 'b'], [15.6, 42, 16, 'c'], [16.2, 56, -24, 'a'],
  [18.7, 32, 44, 'd'], [19.2, 50, -6, 'b'], [19.6, 64, 28, 'c'], [20.1, 40, -36, 'a'], [20.6, 56, 10, 'd'],
  [21.4, 30, -16, 'b'], [21.9, 48, 52, 'c'], [22.3, 62, -28, 'a'], [22.8, 40, 20, 'd'],
];

export default function WhySequence() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(reduced ? 50 : 100);   // % of the panel showing "stacked"
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [panelRef, inView] = useInView({ threshold: 0.35, once: true });
  const stageRef = useRef(null);

  // Capsules land first, then the handle sweeps stacked → sequenced.
  useEffect(() => {
    if (!inView || touched || reduced) return;
    const t = window.setTimeout(() => setPos(50), 480);
    return () => window.clearTimeout(t);
  }, [inView, touched, reduced]);

  const moveTo = (clientX) => {
    const r = stageRef.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const onDown = (e) => {
    setTouched(true); setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onMove = (e) => { if (dragging) moveTo(e.clientX); };
  const onUp = () => setDragging(false);
  const onKey = (e) => {
    const step = e.shiftKey ? 20 : 5;
    const next = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); setTouched(true);
    setPos(Math.min(100, Math.max(0, next)));
  };

  const setStage = (el) => {
    stageRef.current = el;
    panelRef.current = el;
  };

  return (
    <section id="why" className="section why" aria-labelledby="why-title">
      <div className="shell">
        <div className="why__head">
          <WhyTitle lines={why.titleLines} />
          <Reveal as="p" className="lead-text why__body">
            {why.bodyLines.map((line, i) => (
              <span key={i} className="why__body-line">{line}</span>
            ))}
          </Reveal>
        </div>

        <div
          className={`day2 ${inView ? 'is-in' : ''}`}
          style={{ '--pos': `${pos}%` }}
        >
          <div
            ref={setStage}
            className={`day2__stage ${dragging ? 'is-dragging' : ''} ${touched ? 'is-touched' : ''}`}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          >

            {/* Stacked: the whole panel underneath */}
            <div className="day2__layer day2__layer--stacked">
              <div className="day2__label">
                <strong>{why.stacked.label}</strong>
              </div>
              <div className="day2__track" aria-hidden="true">
                {capsules.map(([h, y, r, tone], i) => (
                  <span key={i} className={`capsule capsule--${tone}`}
                    style={{ left: at(h), top: `${y}%`, '--r': `${r}deg`, '--i': i }} />
                ))}
              </div>
              <Axis />
            </div>

            {/* Sequenced: same day, revealed to the right of the handle */}
            <div className="day2__layer day2__layer--seq">
              <div className="day2__label day2__label--right">
                <strong>{why.sequenced.label}</strong>
              </div>
              <div className="day2__track">
                <span className="day2__line" style={{ left: at(8.5), width: `calc(${at(21.5)} - ${at(8.5)})` }} aria-hidden="true" />
                <div className="dose dose--am" style={{ left: at(8.5) }}>
                  <span className="dose__jar frame"><Img name="origin-jar" alt="" sizes="64px" /></span>
                  <span className="dose__text">{why.sequenced.morning}</span>
                </div>
                <div className="dose dose--pm" style={{ left: at(21.5) }}>
                  <span className="dose__jar frame"><Img name="restore-jar" alt="" sizes="64px" /></span>
                  <span className="dose__text">{why.sequenced.evening}</span>
                </div>
              </div>
              <Axis light />
            </div>

            {/* Handle */}
            <div className="day2__handle" role="slider" tabIndex={0}
              aria-label="Compare a stacked day with a sequenced day" aria-valuemin={0} aria-valuemax={100}
              aria-valuenow={Math.round(pos)} aria-valuetext={`${Math.round(pos)}% stacked, ${Math.round(100 - pos)}% sequenced`}
              onKeyDown={onKey}>
              <span className="day2__knob">
                <Icon name="arrow" size={14} className="day2__arrow day2__arrow--l" />
                <Icon name="arrow" size={14} className="day2__arrow" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Axis({ light = false }) {
  return (
    <div className={`day2__axis ${light ? 'day2__axis--light' : ''}`} aria-hidden="true">
      {ticks.map((h) => <span key={h} style={{ left: at(h) }}>{tickLabel(h)}</span>)}
    </div>
  );
}

// The heading acts out its own words. Line one arrives as a pile — every word on top of the
// first, jostling — then pushes apart. Line two follows calmly, one word at a time, in order,
// and a gold line draws under its last word.
const PILE = [[-7, -6, 10], [5, 7, -12], [-3, 2, 8], [6, -4, -6]];   // [rotate°, dy px, jostle px]

function WhyTitle({ lines }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const pileRef = useRef(null);
  const [first, second] = lines.map((l) => l.split(' '));

  // How far each word of line one sits from the first word: that's where it starts, piled up
  useLayoutEffect(() => {
    const measure = () => {
      const words = pileRef.current?.querySelectorAll('.why-t__pile');
      if (!words?.length) return;
      const x0 = words[0].offsetLeft, y0 = words[0].offsetTop;
      words.forEach((w) => {
        w.style.setProperty('--dx', `${x0 - w.offsetLeft}px`);
        w.style.setProperty('--dy0', `${y0 - w.offsetTop}px`);
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <h2 id="why-title" ref={ref} className={`h-lg why__title why-t ${inView ? 'is-in' : ''}`}>
      <span className="why-t__line" ref={pileRef}>
        {first.map((w, i) => {
          const [r, dy, jx] = PILE[i % PILE.length];
          return (
            <Fragment key={i}>
              <span className="why-t__pile" style={{ '--r': `${r}deg`, '--dy': `${dy}px`, '--jx': `${jx}px`, '--k': i }}>{w}</span>
              {i < first.length - 1 && ' '}
            </Fragment>
          );
        })}
      </span>{' '}
      <span className="why-t__line is-accent">
        {second.map((w, i) => (
          <Fragment key={i}>
            <span className="why-t__mask">
              <span className={`why-t__seq ${i === second.length - 1 ? 'why-t__last' : ''}`} style={{ '--n': i }}>{w}</span>
            </span>
            {i < second.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </h2>
  );
}

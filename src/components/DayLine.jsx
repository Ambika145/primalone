import { useState } from 'react';
import { how } from '../data/content.js';
import { Img, Reveal, SafetyNote } from './ui/primitives.jsx';
import './DayLine.css';

// How it works: the day as three photo panels, all visible at once. The one you point at
// (or tap / focus) widens a little; on phones the panels become a swipeable row.
export default function DayLine() {
  const [active, setActive] = useState(0);
  return (
    <section id="how" className="section day" aria-labelledby="how-title">
      <div className="shell">
        <Reveal as="h2" id="how-title" className="day__title">
          {how.titleLines[0]} <span className="is-accent">{how.titleLines[1]}</span>
        </Reveal>
        <Reveal as="p" delay={100} className="lead-text day__lead">{how.lead}</Reveal>

        <ol className="day-panels">
          {how.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} style={{ '--k': i }}
              className={`day-panel day-panel--${s.tone} ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
              tabIndex={0}>
              <div className="day-panel__img frame">
                <Img name={s.image.name} alt={s.image.alt} sizes="(min-width: 992px) 40vw, 85vw" />
              </div>
              {/* sunlight passing across the panels in turn, morning → day → evening */}
              <span className="day-panel__light" aria-hidden="true" />
              <div className="day-panel__text">
                <h3 className="day-panel__title">
                  {s.title}
                  {s.optional && <span className="day-panel__opt">Optional</span>}
                </h3>
                <p className="day-panel__body">{s.body}</p>
                <SafetyNote tone="dark" className="day-panel__safety" />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

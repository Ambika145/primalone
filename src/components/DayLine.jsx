import { how } from '../data/content.js';
import { Img, Reveal } from './ui/primitives.jsx';
import './DayLine.css';

// How it works: the day as three photo cards side by side, each named in large type across
// the photo (after seed.com's "Fueled by science" row). Phones swipe through them.
export default function DayLine() {
  return (
    <section id="how" className="section day" aria-labelledby="how-title">
      <div className="shell">
        <Reveal as="h2" id="how-title" className="day__title">
          {how.titleLines[0]} <span className="is-accent">{how.titleLines[1]}</span>
        </Reveal>
        <Reveal as="p" delay={100} className="lead-text day__lead">{how.lead}</Reveal>

        <ol className="day-cards">
          {how.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className={`day-card day-card--${s.tone}`}>
              <div className="day-card__img frame">
                <Img name={s.image.name} alt={s.image.alt} sizes="(min-width: 992px) 31vw, 80vw" />
              </div>
              <div className="day-card__text">
                <h3 className="day-card__title">{s.title.replace(/\.$/, '')}</h3>
                {s.optional && <span className="day-card__opt">Optional</span>}
                <p className="day-card__body">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

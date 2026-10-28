import { useEffect, useState } from 'react';
import { hero } from '../data/content.js';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import Icon from './ui/Icon.jsx';
import { Button, Img, SplitLines, TextLink } from './ui/primitives.jsx';
import './Hero.css';

// Seconds each scene stays before the hero moves on (morning → evening → morning…).
const SCENE_SECONDS = 7;

export default function Hero() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  // Autoplay runs until the visitor picks a scene or presses pause; never with reduced motion.
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [sectionRef, inView] = useInView({ threshold: 0.2, once: false });
  const playing = autoplay && !reduced;
  const held = hovering || !inView;

  const scene = hero.scenes[index];
  const night = scene.id === 'evening';

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Lets the navbar switch to light type while it sits over the night scene.
  useEffect(() => {
    document.documentElement.dataset.heroTone = night ? 'night' : 'day';
    return () => { delete document.documentElement.dataset.heroTone; };
  }, [night]);

  const choose = (i) => { setAutoplay(false); setIndex(i); };
  const next = () => setIndex((i) => (i + 1) % hero.scenes.length);

  return (
    <section id="hero" ref={sectionRef}
      className={`hero ${night ? 'is-night on-night' : 'is-day'} ${ready ? 'is-ready' : ''}`}
      aria-labelledby="hero-title">

      {/* Full-bleed photography, one per scene, cross-fading on the right */}
      <div className="hero__media" aria-hidden="true">
        {hero.scenes.map((s, i) => (
          <div key={s.id} className={`hero__photo hero__photo--${s.id} ${i === index ? 'is-active' : ''}`}>
            <Img name={s.image.name} alt="" priority={i === 0} sizes="(min-width: 992px) 64vw, 100vw" />
          </div>
        ))}
      </div>

      <div className="shell hero__inner">
        <div className="hero__copy">
          <SplitLines as="h1" id="hero-title" lines={hero.titleLines} className="display hero__title" accentLast />
          <p className="hero__sub">{hero.sub}</p>
          <div className="hero__actions">
            <Button href="#shop" variant={night ? 'light' : 'dark'}>{hero.primary}</Button>
            <TextLink href="#how">{hero.secondary}</TextLink>
          </div>
        </div>

        {/* Scene switcher: one card per scene. Pauses only while the pointer or keyboard focus is on the switcher itself; the hero
            fills the screen, so pausing on hover of the whole section would rarely let it play. */}
        <div className="hero__dock" role="group" aria-label="Origin and Restore"
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
          <div className="hero__scenes">
            {hero.scenes.map((s, i) => (
              <button key={s.id} type="button" className={`hero__scene ${i === index ? 'is-active' : ''}`}
                aria-pressed={i === index} onClick={() => choose(i)}>
                <span className="hero__scene-text">
                  <strong>{s.product}</strong>
                  <span className="hero__scene-note">{s.note}</span>
                </span>
                {i === index && playing && (
                  <span key={`${index}-${autoplay}`} className={`hero__progress ${held ? 'is-held' : ''}`}
                    style={{ animationDuration: `${SCENE_SECONDS}s` }} onAnimationEnd={next} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
          {!reduced && (
            <button type="button" className="hero__pause" onClick={() => setAutoplay((a) => !a)}
              aria-label={autoplay ? 'Pause the morning and evening slideshow' : 'Play the morning and evening slideshow'}>
              <Icon name={autoplay ? 'pause' : 'play'} size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

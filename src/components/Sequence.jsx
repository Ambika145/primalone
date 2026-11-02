import { Fragment, useEffect, useRef } from 'react';
import { products, sequence } from '../data/content.js';
import { useMediaQuery, useReducedMotion } from '../hooks/motion.js';
import { Reveal, Tbc } from './ui/primitives.jsx';
import './Sequence.css';

// Masked words / letters that rise one after another when their Reveal parent comes into view.
function Words({ text, start = 0 }) {
  // the space sits between words, outside the inline-block, so it isn't collapsed
  return text.split(' ').map((w, i, all) => (
    <Fragment key={i}>
      <span className="rise"><span style={{ '--n': start + i }}>{w}</span></span>{i < all.length - 1 && ' '}
    </Fragment>
  ));
}
function Letters({ text }) {
  return [...text].map((ch, i) => (
    <span key={i} className="rise rise--tight"><span style={{ '--n': i }}>{ch}</span></span>
  ));
}

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// One product panel. The giant name glides sideways and the jar turns, both driven by scroll
// (the parent writes --p on the panel and sets the video's frame; nothing here re-renders).
function ProductPanel({ product, tone, videoRef }) {
  const p = products[product];
  const dark = tone === 'night';
  const ribbon = Array.from({ length: 6 }, () => p.name).join('  ');
  return (
    <article id={p.id} className={`pblock pblock--${tone} ${dark ? 'on-night' : ''}`} aria-labelledby={`${p.id}-title`}>
      <div className="pblock__ribbon" aria-hidden="true"><span>{ribbon}</span></div>
      <div className="shell pblock__shell">
        <div className="pblock__grid">
          <Reveal className="pblock__text">
            <h3 id={`${p.id}-title`} className="pblock__heading">
              <span className="pblock__name"><Letters text={p.name} /></span>
              <span className="visually-hidden">: </span>
              <span className="pblock__title">{p.title}</span>
            </h3>
            {p.paras.map((para, i) => (
              <p key={i} className="pblock__para">
                {typeof para === 'string' ? para : <>{para.text}<strong>{para.strong}</strong></>}
              </p>
            ))}
          </Reveal>

          <figure className="pblock__visual">
            <div className="pblock__card">
              {/* The jar's 360° turn, scrubbed by scroll rather than played */}
              <video ref={videoRef} className="pblock__video" src={p.image.scrub} muted playsInline preload="auto"
                aria-label={p.image.alt} />
            </div>
            {p.formatTbc && <figcaption className="fine pblock__caption">{p.formatTbc} <Tbc /></figcaption>}
          </figure>

          <Reveal delay={120} className="pblock__contains">
            <h4 className="mono">{p.containsTitle}</h4>
            <ol className="contains">
              {p.contains.map((item, i) => (
                <li key={item} style={{ '--i': i }}>
                  <span className="contains__label">{item}</span>
                </li>
              ))}
            </ol>
            <p className="pblock__meta fine">{p.meta.join(' · ')}</p>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

// Origin and Restore side by side on one track. On desktop the track pins and scrolling down
// slides it sideways from Origin to Restore; on phones the panels stack and each runs its own
// scroll progress. Either way the names glide and the jars turn with the scroll.
export default function Sequence() {
  const wide = useMediaQuery('(min-width: 992px)');
  const reduced = useReducedMotion();
  const horizontal = wide && !reduced;
  const trackRef = useRef(null);
  const originVideo = useRef(null);
  const restoreVideo = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = [...track.querySelectorAll('.pblock')];
    const videos = [originVideo.current, restoreVideo.current];
    let frame = 0;

    const scrub = (video, t) => {
      if (!video || !video.duration) return;
      const time = clamp01(t) * (video.duration - 0.05);
      if (Math.abs(video.currentTime - time) > 0.02) video.currentTime = time;
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      if (horizontal) {
        // Whole track: hold on Origin briefly, slide across, then hold on Restore
        const r = track.getBoundingClientRect();
        const p = clamp01(-r.top / (r.height - vh));
        track.style.setProperty('--slide', clamp01((p - 0.12) / 0.76).toFixed(4));
        panels.forEach((el) => el.style.setProperty('--p', p.toFixed(4)));
        scrub(videos[0], p / 0.55);
        scrub(videos[1], (p - 0.45) / 0.55);
      } else {
        // Each panel's own progress through the viewport
        panels.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const p = clamp01((vh - r.top) / (vh + r.height));
          el.style.setProperty('--p', p.toFixed(4));
          scrub(videos[i], (p - 0.1) / 0.8);
        });
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // The first frame needs the video's duration, which arrives with its metadata
    videos.forEach((v) => v?.addEventListener('loadedmetadata', onScroll));
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      videos.forEach((v) => v?.removeEventListener('loadedmetadata', onScroll));
      cancelAnimationFrame(frame);
      track.style.removeProperty('--slide');
    };
  }, [horizontal]);

  return (
    <section id="sequence" className="sequence" aria-labelledby="sequence-title">
      {/* Intro: one-line heading, then the description, opening onto the product track below */}
      <div className="sequence__intro">
        <div className="shell">
          <Reveal as="h2" id="sequence-title" className="sequence__title">
            <Words text={sequence.titleLines.slice(0, -1).join(' ')} />{' '}
            <span className="is-accent"><Words text={sequence.titleLines.at(-1)} start={sequence.titleLines.slice(0, -1).join(' ').split(' ').length} /></span>
          </Reveal>
          <Reveal as="p" delay={120} className="lead-text sequence__lead">{sequence.lead}</Reveal>
        </div>
      </div>

      <div ref={trackRef} className={`ptrack ${horizontal ? 'ptrack--horizontal' : ''}`}>
        <div className="ptrack__pin">
          <div className="ptrack__rail">
            <ProductPanel product="origin" tone="morning" videoRef={originVideo} />
            <ProductPanel product="restore" tone="night" videoRef={restoreVideo} />
          </div>
        </div>
      </div>
    </section>
  );
}

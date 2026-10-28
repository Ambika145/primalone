import { Fragment, useEffect, useRef, useState } from 'react';
import { products, sequence } from '../data/content.js';
import { useInView, useParallax, useReducedMotion } from '../hooks/motion.js';
import { Img, Reveal, SafetyNote, Tbc, TextLink } from './ui/primitives.jsx';
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

// The jar turning on a loop; plays only while on screen. Reduced motion keeps the still photo.
function ProductVideo({ image }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: '0px', once: false });
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);
  if (reduced) return <Img name={image.name} alt={image.alt} sizes="(min-width: 992px) 30vw, (min-width: 768px) 55vw, 100vw" />;
  return (
    <video
      ref={(el) => { videoRef.current = el; ref.current = el; }}
      className={`pblock__video ${image.videoAlpha ? 'pblock__video--alpha' : ''}`}
      src={image.video}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={image.alt}
    />
  );
}

function ProductBlock({ product, tone }) {
  const p = products[product];
  const visualRef = useParallax(0.06);
  const reduced = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const dark = tone === 'night';

  const startSpin = () => {
    if (reduced || !p.image.spin || spinning) return;
    setSpinning(true);
  };

  return (
    <article id={p.id} className={`pblock pblock--${tone} ${dark ? 'on-night' : ''}`} aria-labelledby={`${p.id}-title`}>
      <span className="pblock__ghost" aria-hidden="true">{p.name}</span>
      <div className="shell">
        <div className="row gy-5 gx-lg-5 align-items-start">
          <div className="col-12 col-lg-4">
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
              {(p.safety || p.blockSafety) && <SafetyNote tone={dark ? 'dark' : 'light'} className="mt-4" />}
            </Reveal>
          </div>

          <div className="col-12 col-md-7 col-lg-4">
            {p.image.cutout ? (
              <Reveal variant="up" as="figure" className="pblock__visual pblock__visual--cutout">
                <div className="pblock__cutout" ref={visualRef}>
                  {/* Only the jar moves: it travels a small circle while staying upright */}
                  <div className={p.image.orbit ? 'jar-orbit' : 'pblock__float'}>
                    <div className="jar-orbit__offset">
                      <div className="jar-orbit__upright">
                        <img src={`/img/${p.image.name}.webp`} alt={p.image.alt} loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : (
            <Reveal variant="mask" as="figure" className="pblock__visual">
              <div
                className={`frame pblock__frame ${p.image.video ? `pblock__frame--video${p.image.videoAlpha ? ' pblock__frame--alpha' : ''}` : ''}${p.image.drift ? ' pblock__frame--drift' : ''}${p.image.spin ? ' pblock__frame--spin' : ''}${spinning ? ' is-spinning' : ''}`}
                ref={p.image.video || p.image.spin ? undefined : visualRef}
                onMouseEnter={p.image.spin ? startSpin : undefined}
                onClick={p.image.spin ? startSpin : undefined}
                onAnimationEnd={p.image.spin ? (e) => {
                  if (e.animationName === 'restore-spin-y') setSpinning(false);
                } : undefined}
              >
                {p.image.video
                  ? <ProductVideo image={p.image} />
                  : <Img name={p.image.name} alt={p.image.alt} sizes="(min-width: 992px) 30vw, (min-width: 768px) 55vw, 100vw" />}
              </div>
              {p.formatTbc && <figcaption className="fine pblock__caption">{p.formatTbc} <Tbc /></figcaption>}
            </Reveal>
            )}
          </div>

          <div className="col-12 col-md-5 col-lg-4">
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
              <TextLink href={p.labelHref}>View full label &amp; amounts</TextLink>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Sequence() {
  return (
    <section id="sequence" className="sequence" aria-labelledby="sequence-title">
      {/* Intro: one-line heading, then the description, opening onto the Origin block below */}
      <div className="sequence__intro">
        <div className="shell">
          <Reveal as="h2" id="sequence-title" className="sequence__title">
            <Words text={sequence.titleLines.slice(0, -1).join(' ')} />{' '}
            <span className="is-accent"><Words text={sequence.titleLines.at(-1)} start={sequence.titleLines.slice(0, -1).join(' ').split(' ').length} /></span>
          </Reveal>
          <Reveal as="p" delay={120} className="lead-text sequence__lead">{sequence.lead}</Reveal>
        </div>
      </div>
      <ProductBlock product="origin" tone="morning" />
      <ProductBlock product="restore" tone="night" />
    </section>
  );
}

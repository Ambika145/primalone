import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR, together } from '../data/pages.js';
import { useCart } from '../context/CartContext.jsx';
import { useInView, useReducedMotion } from '../hooks/motion.js';
import Icon from '../components/ui/Icon.jsx';
import { Button, Img, Reveal, SafetyNote } from '../components/ui/primitives.jsx';
import { Accordion, PageCta, SecHead } from '../components/page/Inner.jsx';
import './ProductDetail.css';

// Hero photo: the single product shot, leaning gently toward the pointer.
function Gallery({ p }) {
  const reduced = useReducedMotion();
  const photo = p.gallery[0];
  const lean = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const unlean = (e) => { e.currentTarget.style.setProperty('--mx', 0); e.currentTarget.style.setProperty('--my', 0); };

  return (
    <div className="pd-gal">
      <div className="pd-gal__frame" onPointerMove={lean} onPointerLeave={unlean}>
        <div className="pd-gal__stage">
          <figure className="pd-gal__slide is-on">
            <Img name={photo.name} alt={photo.alt} sizes="(min-width: 992px) 50vw, 100vw" priority />
          </figure>
        </div>
      </div>
    </div>
  );
}

function BuyBox({ p, ctaRef }) {
  const { add, selected, setSelected } = useCart();
  const days = selected[p.id];
  const size = p.prices.find((s) => s.days === days) || p.prices[0];
  const night = p.id === 'restore';

  return (
    <div className="pd-buy">
      <h1 className="pd-buy__name pd-in" style={{ '--d': 0 }}>{p.name}</h1>
      <p className="pd-buy__desc pd-in" style={{ '--d': 1 }}>{p.descriptor}</p>
      <p className="pd-buy__line pd-in" style={{ '--d': 2 }}>{p.oneLine}</p>

      <dl className="pd-facts pd-in" style={{ '--d': 3 }}>
        {p.facts.map((f) => <div key={f.v}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
      </dl>

      <div className="pd-sizes pd-in" style={{ '--d': 4 }} role="radiogroup" aria-label="Pack size">
        {p.prices.map((s) => (
          <button key={s.days} type="button" role="radio" aria-checked={days === s.days}
            className={`pd-size ${days === s.days ? 'is-on' : ''}`}
            onClick={() => setSelected((prev) => ({ ...prev, [p.id]: s.days }))}>
            <span className="pd-size__dot" aria-hidden="true" />
            <span className="pd-size__days">{s.days} days</span>
            <span className="pd-size__price">{formatINR(s.price)}</span>
            <span className="pd-size__per">≈ {formatINR(s.perDay)} / day</span>
          </button>
        ))}
      </div>

      <div ref={ctaRef} className="pd-in" style={{ '--d': 5 }}>
        <Button className="pill--block pd-buy__cta" variant={night ? 'light' : 'dark'} arrow={false} onClick={() => add(p.id, size.days)}>
          Add to cart <span key={size.price} className="pd-buy__price">{formatINR(size.price)}</span>
        </Button>
      </div>
      <ul className="pd-assure pd-in" style={{ '--d': 6 }}>
        <li><Icon name="tag" size={16} />One-time purchase, no commitment</li>
        <li><Icon name="truck" size={16} />Orders process in 1–2 business days</li>
      </ul>
      {night && <div className="pd-in" style={{ '--d': 7 }}><SafetyNote tone="dark" className="pd-buy__safety" /></div>}

      <div className="pd-in" style={{ '--d': 8 }}>
        <Accordion tone={night ? 'dark' : 'light'} first={false} items={[{ q: 'What it is', a: p.whatItIs }]} />
      </div>
    </div>
  );
}

// Slides up once the main Add to cart button has scrolled out of view
function StickyBuy({ p, show }) {
  const { add, selected } = useCart();
  const size = p.prices.find((s) => s.days === selected[p.id]) || p.prices[0];
  return (
    <div className={`pd-sticky ${show ? 'is-shown' : ''}`} aria-hidden={!show} inert={show ? undefined : ''}>
      <img src={`/img/${p.id}-turn-poster.webp`} alt="" width="48" height="48" />
      <span className="pd-sticky__text"><b>{p.name}</b><small>{size.days}-day pack · {formatINR(size.price)}</small></span>
      <Button arrow={false} onClick={() => add(p.id, size.days)}>Add to cart</Button>
    </div>
  );
}

// The "why" statement lights up word by word as it scrolls through the screen
function ScrollQuote({ text }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const words = text.split(' ');
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      el.style.setProperty('--p', t.toFixed(3));
    };
    const on = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(frame); };
  }, [reduced]);
  return (
    <blockquote ref={ref} className={`pd-quote__text ${reduced ? 'is-static' : ''}`} style={{ '--n': words.length }}>
      <p>{words.map((w, i) => <span key={i} style={{ '--i': i }}>{w} </span>)}</p>
    </blockquote>
  );
}

// Origin + Restore together: the two lanes, the simple path, and the closing line
function Together() {
  const t = together;
  return (
    <section className="x-sec pd-tog">
      <div className="shell">
        <SecHead title={t.title[0]} accent={t.title[1]} lead={t.lead} />
        <div className="pd-tog__panel">
          <div className="pd-tog__lanes">
            {t.lanes.map((l, i) => (
              <Reveal key={l.id} delay={i * 120} className={`pd-tog__lane pd-tog__lane--${l.id}`}>
                <img src={`/img/${l.id}-turn-poster.webp`} alt="" width="96" height="96" loading="lazy" />
                <div>
                  <h3 className="x-h3">{l.name}</h3>
                  <p>{l.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <ul className="pd-tog__notes">
            {t.notes.map((n) => <li key={n}><Icon name="check" size={18} />{n}</li>)}
          </ul>
          <div className="pd-tog__path">
            <h3 className="x-h3">{t.pathTitle}</h3>
            <ol>
              {t.path.map(([when, then], i) => (
                <Reveal as="li" key={when} delay={i * 110}>
                  <span>{when}</span>
                  {then && <><Icon name="arrow" size={18} /><b>{then}</b></>}
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal as="p" className="pd-tog__line">{t.line}</Reveal>
        </div>
      </div>
    </section>
  );
}

// Product detail page for Origin (morning, light) and Restore (night, dark).
export default function ProductDetail({ p }) {
  const night = p.id === 'restore';
  const ctaRef = useRef(null);
  const [ritualRef, ritualIn] = useInView({ threshold: 0.25 });
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`xp pd pd--${p.id} ${night ? 'on-night' : ''}`}>
      {/* ---- Gallery + buy box ---- */}
      <section className="pd-top x-hero">
        <div className="shell pd-top__grid">
          <Gallery p={p} />
          <BuyBox p={p} ctaRef={ctaRef} />
        </div>
      </section>

      {/* ---- What it supports ---- */}
      <section className={`x-sec pd-sup ${night ? 'x-sec--forest' : ''}`}>
        <div className="shell">
          <SecHead title={p.supportsTitle[0]} accent={p.supportsTitle[1]} />
          <ul className="pd-sup__grid">
            {p.supports.map((s, i) => (
              <Reveal as="li" key={s.t} delay={(i % 4) * 90} className="pd-sup__card">
                <h3 className="pd-sup__t">{s.t}</h3>
                <p className="pd-sup__d">{s.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Ingredients ---- */}
      <section id="label" className={`x-sec pd-ings ${night ? '' : 'x-sec--sand'}`}>
        <div className="shell">
          <SecHead title={p.ingredientsTitle[0]} accent={p.ingredientsTitle[1]} lead={p.ingredientsLead} />
          <ol className="pd-ings__grid">
            <Reveal as="li" variant="mask" className="pd-ings__photo" aria-hidden="true">
              <div><Img name={p.ingredientsImage} alt="" sizes="(min-width: 992px) 34vw, 90vw" /></div>
            </Reveal>
            {p.ingredients.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 70} className="pd-ing">
                <span className="pd-ing__t">{item}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- The ritual: how-to once, then three photo steps joined by a drawing line ---- */}
      <section className={`x-sec pd-ritual ${night ? 'x-sec--forest' : ''}`}>
        <div className="shell">
          <SecHead title={p.ritualTitle[0]} accent={p.ritualTitle[1]} lead={p.howToUse} />
          <ol ref={ritualRef} className={`pd-ritual__steps ${ritualIn ? 'is-in' : ''}`}>
            {p.ritual.map((r, i) => (
              <li key={r.title} className="pd-step" style={{ '--i': i }}>
                <div className="pd-step__img"><Img name={r.image} alt="" sizes="(min-width: 992px) 30vw, 85vw" /></div>
                <div className="pd-step__cap">
                  <span className="pd-step__n">{i + 1}</span>
                  <h3 className="x-h3">{r.title}</h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Who it's for, what it is not (Origin), and why it matters long-term ---- */}
      <section className={`x-sec pd-why ${night ? '' : 'x-sec--cream'}`}>
        <div className={`shell pd-why__grid ${p.isNot ? '' : 'is-solo'}`}>
          <div className="pd-who">
            <Reveal><h2 className="x-h2">Who it’s <span className="is-accent">for.</span></h2></Reveal>
            <ul className="pd-who__list">
              {p.whoFor.map((w, i) => (
                <Reveal as="li" key={w} delay={i * 120}>
                  <span className="pd-who__icon"><Icon name="check" size={18} /></span>{w}
                </Reveal>
              ))}
            </ul>
          </div>
          {p.isNot && (
            <div className="pd-myth">
              <Reveal className="pd-myth__head">
                <h2 className="x-h2">What Origin <span className="is-accent">is not.</span></h2>
                <p className="x-lead">{p.isNotLead}</p>
              </Reveal>
              <ol className="pd-myth__grid">
                {p.isNot.map((n, i) => (
                  <Reveal as="li" key={n} delay={i * 120} className="pd-myth__card" style={{ '--i': i }}>
                    <div className="pd-myth__not">
                      <span className="pd-myth__label">It’s not</span>
                      <p>{n.replace(/^Not /, '')}</p>
                    </div>
                    <div className="pd-myth__is">
                      <span className="pd-myth__label">It is</span>
                      <p>{p.isInstead[i]}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          )}
          <Reveal delay={100} className="pd-quote">
            <h2 className="pd-quote__label">{p.whyTitle}</h2>
            <ScrollQuote text={p.whyExists} />
          </Reveal>
        </div>
      </section>

      <Together />

      {/* ---- FAQ ---- */}
      <section className={`x-sec pd-faq ${night ? 'x-sec--forest' : 'x-sec--sand'}`}>
        <div className="shell pd-faq__grid">
          <div>
            <SecHead title={p.faqTitle} lead="Short answers about taking it." />
            <Link to="/contact" className="text-link">More help</Link>
          </div>
          <Reveal delay={80}>
            <Accordion items={p.faq} tone={night ? 'dark' : 'light'} />
            <p className="pd-disc">{p.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <PageCta tone={night ? 'sand' : 'night'} title={p.cross.title} body={p.cross.body} image={p.cross.image}
        actions={[{ label: p.cross.label, href: p.cross.href }, { label: 'How the sequence works', href: '/sequence' }]} />

      <StickyBuy p={p} show={stuck} />
    </div>
  );
}

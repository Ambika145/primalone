import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { faqPage, shopPage } from '../data/pages.js';
import { bundle, footer, products, formatINR } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import { useReducedMotion } from '../hooks/motion.js';
import Icon from '../components/ui/Icon.jsx';
import { Button, Reveal, Tbc } from '../components/ui/primitives.jsx';
import { Accordion, SecHead } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import './ShopPage.css';

const afterBundle = (n) => Math.round(n * (1 - bundle.pct / 100));
const priceOf = (id, days) => products[id].sizes.find((s) => s.days === days);
// In shopping order: what's inside, how you buy, how you pay, when it ships
const trust = [
  { icon: 'leaf', title: 'Clear formulas', text: 'No proprietary blends' },
  { icon: 'tag', title: 'One-time purchase', text: 'No subscription or commitment' },
  { icon: 'card', title: 'Easy payment', text: 'UPI, cards and net banking' },
  { icon: 'truck', title: 'Quick processing', text: 'Within 1–2 business days' },
];

// Two-option pack switch (30 / 15 days)
function PackSwitch({ value, onChange, label }) {
  return (
    <div className="xs2-seg" role="radiogroup" aria-label={label}>
      {[30, 15].map((d) => (
        <button key={d} type="button" role="radio" aria-checked={value === d} className={value === d ? 'is-on' : ''} onClick={() => onChange(d)}>
          {d} days
        </button>
      ))}
    </div>
  );
}

// One product card: tinted stage with the jar (turns on hover), name, short copy, pack switch, add
function ProductCard({ id, delay }) {
  const p = products[id];
  const { selected, setSelected, add, highlight } = useCart();
  const days = selected[id];
  const size = priceOf(id, days);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const spin = (on) => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (on) v.play().catch(() => {}); else v.pause();
  };

  return (
    <Reveal delay={delay} className="xs2-cell">
      <article id={`shop-${id}`} className={`xs2-card xs2-card--${id} ${highlight === id ? 'is-highlight' : ''}`}
        aria-labelledby={`card-${id}`} onPointerEnter={() => spin(true)} onPointerLeave={() => spin(false)}>
        <Link to={`/products/${id}`} className="xs2-card__stage" tabIndex={-1} aria-hidden="true">
          {id === 'origin' && <span className="xs2-card__flag">Start here</span>}
          <video ref={videoRef} src={p.image.scrub} poster={`/img/${id}-turn-poster.webp`} muted loop playsInline preload="none" />
        </Link>
        <div className="xs2-card__body">
          <div className="xs2-card__row">
            <h2 id={`card-${id}`} className="xs2-card__name"><Link to={`/products/${id}`}>{p.name}</Link></h2>
            <span className="xs2-card__price"><span key={size.price}>{formatINR(size.price)}</span></span>
          </div>
          <p className="xs2-card__title">{p.title}</p>
          <PackSwitch value={days} label={`${p.name} pack size`} onChange={(d) => setSelected((prev) => ({ ...prev, [id]: d }))} />
          <Button className="pill--block" arrow={false} onClick={() => add(id, days)}>Add to cart</Button>
          <Link to={`/products/${id}`} className="xs2-card__more">View details</Link>
        </div>
      </article>
    </Reveal>
  );
}

// The bundle as its own card: both jars, one pack size for both
function BundleCard({ delay }) {
  const { add } = useCart();
  const [days, setDays] = useState(30);
  const full = priceOf('origin', days).price + priceOf('restore', days).price;
  return (
    <Reveal delay={delay} className="xs2-cell">
      <article className="xs2-card xs2-card--both on-night" aria-labelledby="card-both">
        <div className="xs2-card__stage" aria-hidden="true">
          <span className="xs2-card__flag xs2-card__flag--gold">{bundle.label}</span>
          <span className="xs2-duo">
            <img src="/img/origin-turn-poster.webp" alt="" />
            <img src="/img/restore-turn-poster.webp" alt="" />
          </span>
        </div>
        <div className="xs2-card__body">
          <div className="xs2-card__row">
            <h2 id="card-both" className="xs2-card__name">The sequence</h2>
            <span className="xs2-card__price"><span key={full}>{formatINR(afterBundle(full))}</span><s>{formatINR(full)}</s></span>
          </div>
          <p className="xs2-card__title">Origin and Restore, sequenced.</p>
          <p className="xs2-card__per">{days} days of each {bundle.tbc && <Tbc />}</p>
          <PackSwitch value={days} label="Bundle pack size" onChange={setDays} />
          <Button className="pill--block" variant="light" arrow={false} onClick={() => { add('origin', days); add('restore', days); }}>Add both to cart</Button>
          <Link to="/sequence" className="xs2-card__more">How the sequence works</Link>
        </div>
      </article>
    </Reveal>
  );
}

// Build your day: switch the two windows on/off, pick a pack, see the day and the total
function Builder() {
  const { add } = useCart();
  const [am, setAm] = useState(true);
  const [pm, setPm] = useState(false);
  const [days, setDays] = useState(30);
  const both = am && pm;
  const full = (am ? priceOf('origin', days).price : 0) + (pm ? priceOf('restore', days).price : 0);
  const total = both ? afterBundle(full) : full;
  const slots = [
    { id: 'origin', on: am, set: setAm, when: 'Morning', left: '20%' },
    { id: 'restore', on: pm, set: setPm, when: 'Evening', left: '84%' },
  ];

  return (
    <section className="x-sec x-sec--forest on-night xs2-build">
      <div className="shell">
        <SecHead title="Build" accent="your day." lead="Turn on the windows you want. Your day, and your total, update as you go." />
        <div className="xs2-build__grid">
          <div className="xs2-build__picks">
            {slots.map((s) => (
              <button key={s.id} type="button" role="switch" aria-checked={s.on} className={`xs2-pick ${s.on ? 'is-on' : ''}`} onClick={() => s.set(!s.on)}>
                <img src={`/img/${s.id}-turn-poster.webp`} alt="" />
                <span className="xs2-pick__text">
                  <small>{s.when}</small>
                  <b>{products[s.id].name}</b>
                </span>
                <span className="xs2-pick__toggle" aria-hidden="true"><i /></span>
              </button>
            ))}
            <div className="xs2-build__pack">
              <span>Pack size</span>
              <PackSwitch value={days} onChange={setDays} label="Pack size" />
            </div>
          </div>

          <div className="xs2-build__panel">
            <div className="xs2-day" aria-hidden="true">
              <div className="xs2-day__track" />
              {slots.map((s) => (
                <span key={s.id} className={`xs2-day__dot ${s.on ? 'is-on' : ''}`} style={{ left: s.left }}>
                  <img src={`/img/${s.id}-turn-poster.webp`} alt="" />
                </span>
              ))}
              <ol className="xs2-day__ticks"><li>6 am</li><li>12 pm</li><li>6 pm</li><li>12 am</li></ol>
            </div>
            <div className="xs2-sum">
              <div className="xs2-sum__lines">
                {am && <p><span>Origin · {days} days</span><span>{formatINR(priceOf('origin', days).price)}</span></p>}
                {pm && <p><span>Restore · {days} days</span><span>{formatINR(priceOf('restore', days).price)}</span></p>}
                {both && <p className="is-save"><span>{bundle.label} {bundle.tbc && <Tbc />}</span><span>−{formatINR(full - total)}</span></p>}
                {!am && !pm && <p className="is-empty"><span>Pick at least one window.</span></p>}
              </div>
              <div className="xs2-sum__total"><span>Total</span><b key={total}>{formatINR(total)}</b></div>
              <Button className="pill--block" variant="light" arrow={false} disabled={!am && !pm}
                onClick={() => { if (am) add('origin', days); if (pm) add('restore', days); }}>
                Add to cart
              </Button>
              {!both && am && <button type="button" className="xs2-sum__hint" onClick={() => setPm(true)}>Add the evening and save {bundle.pct}% →</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ShopPage() {
  const p = shopPage;
  const orderFaq = faqPage.groups.find((g) => g.id === 'orders').items;

  return (
    <div className="xp xs2">
      {/* ---- Hero ---- */}
      <header className="x-hero xs2-hero">
        <div className="shell xs2-hero__grid">
          <Reveal as="h1" id="shop-page-title" className="x-h1 xs2-hero__title">
            {p.titleLines[0]} <span className="is-accent">{p.titleLines[1]}</span>
          </Reveal>
        </div>
        <div className="shell">
          <Reveal delay={200} as="ul" className="xs2-trust">
            {trust.map((t, i) => (
              <li key={t.title} style={{ '--i': i }}>
                <span className="xs2-trust__icon"><Icon name={t.icon} size={20} /></span>
                <span className="xs2-trust__copy"><b>{t.title}</b><small>{t.text}</small></span>
              </li>
            ))}
          </Reveal>
        </div>
      </header>

      {/* ---- Products ---- */}
      <section className="xs2-products" aria-label="Products">
        <div className="shell xs2-grid">
          <ProductCard id="origin" delay={0} />
          <ProductCard id="restore" delay={100} />
          <BundleCard delay={200} />
        </div>
      </section>

      {/* ---- Comparison ---- */}
      <section className="x-sec xs2-compare">
        <div className="shell">
          <SecHead title={p.compareTitle[0]} accent={p.compareTitle[1]} lead="Two products with two different jobs, at two different times of day." center />
          {/* Comparison card: questions on the left, Origin and Restore as two tinted lanes */}
          <Reveal className="xs4" role="table" aria-label="Origin and Restore compared">
            <div className="xs4__row xs4__head" role="row">
              <span role="columnheader" className="xs4__k"><span className="visually-hidden">Detail</span></span>
              {['origin', 'restore'].map((id) => (
                <span key={id} role="columnheader" className={`xs4__cell xs4__cell--${id} xs4__prod`}>
                  <img src={`/img/${id}-turn-poster.webp`} alt="" width="64" height="64" />
                  <b>{products[id].name}</b>
                </span>
              ))}
            </div>
            {p.compare.map((r, i) => {
              const same = r.origin === r.restore;
              return (
                <div key={r.k} className={`xs4__row ${same ? 'is-same' : ''}`} role="row" style={{ '--i': i }}>
                  <span role="rowheader" className="xs4__k">{r.k}</span>
                  {same ? (
                    <>
                      <span role="cell" className="xs4__cell xs4__cell--origin xs4__cell--blank"><span className="visually-hidden">{r.origin}</span></span>
                      <span role="cell" className="xs4__cell xs4__cell--restore xs4__cell--blank">
                        <span className="visually-hidden">{r.restore}</span>
                        <span className="xs4__never" aria-hidden="true">{r.origin}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span role="cell" className="xs4__cell xs4__cell--origin">{r.origin}</span>
                      <span role="cell" className="xs4__cell xs4__cell--restore">{r.restore}</span>
                    </>
                  )}
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <Builder />

      {/* ---- Quality ---- */}
      <section className="x-sec--sand xs2-quality">
        <div className="shell xs2-quality__grid">
          <Reveal className="xs2-q"><span><Icon name="check" size={20} /></span><b>Third-party tested</b></Reveal>
          <Reveal delay={80} className="xs2-q xs2-q--wide"><span><Icon name="leaf" size={20} /></span><p>{footer.manufacturer}</p></Reveal>
        </div>
      </section>

      {/* ---- Order FAQ ---- */}
      <section className="x-sec xs2-faq">
        <div className="shell xs2-faq__grid">
          <div>
            <SecHead title="Orders &" accent="delivery." lead="The short answers before you check out." />
            <Link to="/contact" className="text-link">More help</Link>
          </div>
          <Reveal delay={80}><Accordion items={orderFaq} /></Reveal>
        </div>
      </section>
    </div>
  );
}

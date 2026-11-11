import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aboutPage } from '../data/pages.js';
import { formatINR, products } from '../data/content.js';
import Icon from '../components/ui/Icon.jsx';
import { Img, Reveal } from '../components/ui/primitives.jsx';
import { useInView } from '../hooks/motion.js';
import './AboutSections.css';

const fromPrice = (id) => formatINR(Math.min(...products[id].sizes.map((s) => s.price)));
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* What's really on India's plate: each figure drawn as a plate ring   */
/* ------------------------------------------------------------------ */
function useCount(target, run, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    if (reduced()) { setN(target); return undefined; }
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return n;
}

function PlateStat({ s, i, run }) {
  const n = useCount(s.value, run);
  const p = run ? Math.min(s.value, 100) : 0;
  return (
    <li className={`xa-pl xa-pl--${s.tone}`} style={{ '--i': i, '--p': p }}>
      <div className="xa-pl__scale" aria-hidden="true"><span>0%</span><span>100%</span></div>
      <div className="xa-pl__bar" role="img" aria-label={`${s.value}${s.suffix} ${s.of}`}>
        <span className="xa-pl__fill" />
        <i className="xa-pl__mark"><b className="xa-pl__tip">{s.value}{s.suffix}</b></i>
        <span className="xa-pl__rest" />
      </div>
      <p className="xa-pl__num"><span>{n}</span><em>{s.suffix}</em></p>
      <h3 className="xa-pl__label">{s.label}</h3>
      <p className="xa-pl__body">{s.body}<sup>{s.ref}</sup></p>
    </li>
  );
}

export function PlateSection() {
  const d = aboutPage.plate;
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <section className="x-sec xa-plate" aria-labelledby="plate-title">
      <div className="shell">
        <Reveal className="xa-plate__head">
          <h2 id="plate-title" className="x-h2">{d.title}</h2>
          <p className="xa-plate__lead">{d.lead}</p>
        </Reveal>
        <ol ref={ref} className={`xa-plate__grid ${inView ? 'is-in' : ''}`}>
          {d.stats.map((s, i) => <PlateStat key={s.label} s={s} i={i} run={inView} />)}
        </ol>
        <Reveal className="xa-plate__foot" delay={500}>
          <p className="xa-plate__src"><b>Sources:</b> {d.sources.map((t, i) => <span key={i}><sup>{i + 1}</sup>{t} </span>)}</p>
          <p className="xa-plate__disc"><b>Please note:</b> {d.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The everyday gap: reality -> gap -> where PrimalOne fits             */
/* ------------------------------------------------------------------ */
function RowLabel({ r }) {
  return (
    <div className="xa-gap__label">
      <span>{r.n}</span>
      <b>{r.h}</b>
      <p>{r.p}</p>
    </div>
  );
}

export function GapSection() {
  const g = aboutPage.gap;
  return (
    <section className="x-sec xa-gap" aria-labelledby="gap-title">
      <div className="shell">
        <Reveal className="xa-gap__head">
          <div>
            <p className="xa-eyebrow">{g.eyebrow}</p>
            <h2 id="gap-title" className="x-h2">{g.title} <span className="is-accent">{g.accent}</span></h2>
          </div>
          <p className="xa-gap__lead">{g.lead}</p>
        </Reveal>

        {/* 01 The reality */}
        <div className="xa-gap__row">
          <RowLabel r={g.rows[0]} />
          {g.columns.map((c, i) => (
            <Reveal key={c.reality} delay={i * 90} className={`xa-real xa-real--${i}`}>
              <div className="xa-real__tile" aria-hidden="true">
                <Img name={c.photo} alt="" sizes="(min-width: 992px) 18vw, 46vw" style={{ objectPosition: c.pos }} />
                <span className="xa-real__icon"><Icon name={c.icon} size={18} /></span>
              </div>
              <h3>{c.reality}</h3>
              <p>{c.realityBody}</p>
            </Reveal>
          ))}
        </div>

        {/* 02 The gap */}
        <div className="xa-gap__row xa-gap__row--gap">
          <RowLabel r={g.rows[1]} />
          {g.columns.map((c, i) => (
            <Reveal key={c.gap} delay={200 + i * 90} className={`xa-miss ${i === 3 ? 'is-night' : ''}`}>
              <span className="xa-miss__dot" aria-hidden="true" />
              <span className="xa-miss__k">Can go missing</span>
              <h3>{c.gap}</h3>
              <p>{c.gapBody}</p>
            </Reveal>
          ))}
        </div>

        {/* Where PrimalOne fits */}
        <div className="xa-gap__row xa-gap__row--band">
          <span aria-hidden="true" />
          <Reveal className="xa-band on-night">
            <span className="xa-band__tag">{g.band.tag}</span>
            <h3>{g.band.title} <span>{g.band.accent}</span></h3>
            <p>{g.band.body}</p>
          </Reveal>
        </div>

        {/* 03 Where we fit */}
        <div className="xa-gap__row xa-gap__row--sol">
          <RowLabel r={g.rows[2]} />
          {g.solutions.map((s, i) => {
            const pr = products[s.id];
            return (
              <Reveal key={s.id} delay={i * 120} className={`xa-sol xa-sol--${s.id}`} style={{ gridColumn: `span ${s.span}` }}>
                <span className="xa-sol__img"><Img name={`${s.id}-jar`} alt={`${pr.name} jar`} sizes="(min-width: 992px) 220px, 60vw" /></span>
                <div className="xa-sol__body">
                  <span className="xa-sol__when"><Icon name={s.id === 'origin' ? 'sun' : 'moon'} size={14} /> {s.when}</span>
                  <h3>{pr.name}</h3>
                  {s.span > 1 ? (
                    <ul className="xa-sol__chips" aria-label={`Inside ${pr.name}`}>
                      {s.line.split(/, | and /).map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  ) : <p>{s.line}</p>}
                  <Link to={`/products/${s.id}`} className="xa-sol__go">Explore {pr.name} · from {fromPrice(s.id)}<Icon name="arrow" size={15} /></Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="xa-gap__foot">
          <p>{g.note}</p>
          <Link to="/shop" className="pill">
            <span className="pill__label">Explore the range</span>
            <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ingredient philosophy                                                */
/* ------------------------------------------------------------------ */
export function PhilosophySection() {
  const d = aboutPage.philosophy;
  return (
    <section className="x-sec xa-phil" aria-labelledby="phil-title">
      <div className="shell xa-phil__grid">
        <div className="xa-phil__text">
          <Reveal>
            <p className="xa-eyebrow">{d.eyebrow}</p>
            <h2 id="phil-title" className="x-h2">{d.title}<br /><span className="is-accent">{d.accent}</span></h2>
            <p className="x-lead">{d.lead}</p>
          </Reveal>
          <ol className="xa-phil__points">
            {d.points.map((pt, i) => (
              <Reveal as="li" key={pt.h} delay={i * 90}>
                <h3><span>0{i + 1}</span>{pt.h}</h3>
                <p>{pt.p}</p>
              </Reveal>
            ))}
          </ol>
          <div className="xa-phil__links">
            <Link to={products.origin.labelHref} className="xa-textlink">Read the Origin label<Icon name="arrow" size={15} /></Link>
            <Link to={products.restore.labelHref} className="xa-textlink">Read the Restore label<Icon name="arrow" size={15} /></Link>
          </div>
        </div>

        <div className="xa-phil__mosaic">
          <Reveal className="xa-phil__big">
            <Img name="origin-scoop" alt="Origin powder spilling from a walnut scoop" sizes="(min-width: 992px) 46vw, 92vw" />
            <span className="xa-phil__tag">{d.tag}</span>
          </Reveal>
          <Reveal delay={120} className="xa-phil__small">
            <Img name="lab-droplet" alt="A precise droplet falling into a glass vial" sizes="(min-width: 992px) 23vw, 46vw" />
          </Reveal>
          <Reveal delay={220} className="xa-phil__card on-night">
            <h3>{d.card.title}</h3>
            <p>{d.card.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The range: Morning / Night switch with each product's full story     */
/* ------------------------------------------------------------------ */
export function RangeSection() {
  const r = aboutPage.range;
  const ids = ['origin', 'restore'];
  const [id, setId] = useState('origin');
  const it = r.items[id];
  const pr = products[id];
  const night = id === 'restore';

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = ids[(ids.indexOf(id) + 1) % 2];
    setId(next);
    document.getElementById(`range-tab-${next}`)?.focus();
  };

  return (
    <section className={`x-sec xa-range ${night ? 'is-night on-night' : ''}`} aria-labelledby="range-title">
      <div className="shell">
        <div className="xa-range__head">
          <div>
            <p className="xa-eyebrow">{r.eyebrow}</p>
            <h2 id="range-title" className="x-h2">{r.title} <span className="is-accent">{r.accent}</span></h2>
          </div>
          <div className="xa-switch" role="tablist" aria-label="Choose a product" onKeyDown={onKey}>
            <span className="xa-switch__thumb" aria-hidden="true" />
            {ids.map((k) => (
              <button key={k} id={`range-tab-${k}`} type="button" role="tab" aria-selected={id === k} aria-controls="range-panel"
                tabIndex={id === k ? 0 : -1} className={id === k ? 'is-on' : ''} onClick={() => setId(k)}>
                <Icon name={k === 'origin' ? 'sun' : 'moon'} size={16} />
                <span>{products[k].name}</span>
                <small>{r.items[k].tab}</small>
              </button>
            ))}
          </div>
        </div>

        <div id="range-panel" role="tabpanel" aria-labelledby={`range-tab-${id}`} key={id} className="xa-range__panel">
          <aside className="xa-range__card">
            <div className="xa-range__media">
              <Img name={it.img} alt={it.imgAlt} sizes="(min-width: 992px) 36vw, 92vw" style={night ? { objectPosition: '72% 50%' } : undefined} />
              <span className="xa-range__badge"><Icon name={night ? 'moon' : 'sun'} size={14} /> {it.tab}</span>
            </div>
            <div className="xa-range__intro">
              <span className="xa-range__kicker">{it.kicker}</span>
              <h3 className="xa-range__name">{pr.name}</h3>
              <p>{it.intro}</p>
              <div className="xa-range__buy">
                <span>From <b>{fromPrice(id)}</b></span>
                <Link to={`/products/${id}`} className={`pill ${night ? 'pill--light' : ''}`}>
                  <span className="pill__label">Explore {pr.name}</span>
                  <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="xa-range__detail">
            <h3 className="xa-range__sub">{it.supportsTitle}</h3>
            <ol className="xa-supports">
              {it.supports.map(([h, p], i) => (
                <li key={h} style={{ '--i': i }}>
                  <span className="xa-supports__n">{String(i + 1).padStart(2, '0')}</span>
                  <div><b>{h}</b><p>{p}</p></div>
                </li>
              ))}
            </ol>

            <div className="xa-facts">
              {[['user', 'Who it’s for', it.who], ['info', 'How to use', it.how]].map(([icon, h, list]) => (
                <div key={h} className="xa-fact">
                  <span className="xa-fact__icon"><Icon name={icon} size={18} /></span>
                  <h4>{h}</h4>
                  {list.map((t) => <p key={t}>{t}</p>)}
                </div>
              ))}
              <div className="xa-fact xa-fact--why">
                <span className="xa-fact__icon"><Icon name="trendUp" size={18} /></span>
                <h4>Why it matters long-term</h4>
                <p>{it.why}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Origin + Restore together                                            */
/* ------------------------------------------------------------------ */
export function TogetherSection() {
  const t = aboutPage.range.together;
  return (
    <section className="x-sec x-sec--sand xa-tog" aria-labelledby="tog-title">
      <div className="shell">
        <Reveal className="xa-tog__quote">
          <p className="xa-eyebrow">{t.eyebrow}</p>
          <h2 id="tog-title" className="x-h2">{t.title} <span className="is-accent">{t.accent}</span></h2>
        </Reveal>

        <div className="xa-tog__grid">
          <Reveal className="xa-tog__day">
            <figure className="xa-tog__half xa-tog__half--am">
              <Img name="origin-jar" alt="Origin jar in morning light" sizes="(min-width: 1200px) 20vw, (min-width: 576px) 50vw, 50vw" />
              <figcaption><span className="xa-tog__ic"><Icon name="sun" size={16} /></span><b>Origin</b><small>Morning</small></figcaption>
            </figure>
            <figure className="xa-tog__half xa-tog__half--pm">
              <Img name="restore-evening" alt="Restore jar and glass in the evening" sizes="(min-width: 1200px) 20vw, (min-width: 576px) 50vw, 50vw" />
              <figcaption><span className="xa-tog__ic"><Icon name="moon" size={15} /></span><b>Restore</b><small>Night</small></figcaption>
            </figure>
            <span className="xa-tog__never">Never in the<br />same serving</span>
          </Reveal>

          <Reveal delay={100} className="xa-tog__points">
            <ul>
              {t.points.map((p) => <li key={p}><span><Icon name="check" size={14} /></span>{p}</li>)}
            </ul>
          </Reveal>

          <Reveal delay={200} className="xa-tog__path on-night">
            <h3>{t.pathTitle}</h3>
            <ol>
              {t.path.map((p, i) => (
                <li key={p}><span>{i + 1}</span>{p}</li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="xa-tog__line">
          <p>“{t.quote}”</p>
          <span>{t.quoteSub}</span>
        </Reveal>
      </div>
    </section>
  );
}

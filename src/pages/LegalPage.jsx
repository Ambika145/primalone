import { Fragment, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, NavLink, useLocation } from 'react-router-dom';
import { legalPages } from '../data/pages.js';
import { privacyDoc, returnsDoc, termsDoc } from '../data/legal.js';
import Icon from '../components/ui/Icon.jsx';
import { Reveal } from '../components/ui/primitives.jsx';
import '../components/page/Inner.css';
import './LegalPage.css';

// Full policy documents; Shipping stays a short page in pages.js
const docs = { returns: returnsDoc, privacy: privacyDoc, terms: termsDoc };
const tabs = [
  ['shipping', legalPages.shipping.title, 'truck'],
  ['returns', returnsDoc.title, 'refresh'],
  ['privacy', privacyDoc.title, 'lock'],
  ['terms', termsDoc.title, 'info'],
];

/* ------------------------------------------------------------------ */
/* Plain-language summaries shown above each document                  */
/* ------------------------------------------------------------------ */
const glance = {
  shipping: {
    kind: 'timeline',
    title: 'From checkout to your door',
    steps: [
      { when: 'Checkout', what: 'Your delivery timeline and carrier are confirmed before you pay.' },
      { when: '1–2 business days', what: 'Your order is processed and handed to the carrier.' },
      { when: 'In transit', what: 'Transit times vary by destination within India.' },
      { when: 'Delivered', what: 'Check the parcel and seal as soon as it arrives.' },
    ],
    foot: [
      { icon: 'lock', k: 'Payment', v: 'Online payment at checkout. Cash on delivery is not offered.' },
      { icon: 'refresh', k: 'Damaged on arrival?', v: 'Tell us within 2 business days of delivery. See the Returns policy.' },
      { icon: 'mail', k: 'Shipment questions', v: 'support@primalone.com, with your order reference' },
    ],
  },
  returns: {
    kind: 'timeline',
    title: 'Return windows, counted from delivery',
    steps: [
      { when: 'Same day', what: 'Outer or inner packaging is open, or the security seal is broken' },
      { when: '2 business days', what: 'Product is defective or damaged on delivery' },
      { when: '2 business days', what: 'Product is materially different to what you selected' },
      { when: '7 days', what: 'Any other applicable case' },
    ],
    foot: [
      { icon: 'refresh', k: 'Refunds', v: 'Within 15 business days of approval, to the original payment source' },
      { icon: 'truck', k: 'Returns shipping', v: 'Free, once your request is approved' },
      { icon: 'mail', k: 'Start a request', v: 'support@primalone.com' },
    ],
  },
  privacy: {
    kind: 'cards',
    cards: [
      { icon: 'user', k: 'What we collect', v: 'Details you give us, plus device, browser and cookie data logged when you visit.' },
      { icon: 'lock', k: 'Your rights', chips: ['Access', 'Correct', 'Erase', 'Portability', 'Restrict', 'Withdraw consent'] },
      { icon: 'megaphone', k: 'Marketing', v: 'Opt out any time with the “unsubscribe” link, or email us with the header “Unsubscribe”.' },
      { icon: 'mail', k: 'Questions', v: 'support@primalone.in' },
    ],
  },
  terms: {
    kind: 'stats',
    cards: [
      { big: '18+', k: 'Eligibility', v: 'You must be at least 18 to use the site or place an order.' },
      { big: '14', unit: 'working days', k: 'Estimated delivery', v: 'From payment confirmation. Delivery within India only.' },
      { big: 'GST', unit: 'included', k: 'Prices', v: 'Prices are shown inclusive of Goods and Service Tax.' },
      { big: 'HYD', k: 'Jurisdiction', v: 'Laws of India. Courts in Hyderabad, Telangana.' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const clauseId = (sec, n) => `c-${sec.n}-${n}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
// Letter clauses read the way the documents cross-refer to them ("Section 2C")
const clauseNo = (sec, n) => (/^[A-Z]$/.test(n) ? `${sec.n}${n}` : n);

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+[a-z])/i;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Text with search hits marked and email addresses linked
function Rich({ text, q }) {
  const mark = (s, key) => {
    if (!q) return s;
    const parts = s.split(new RegExp(`(${escapeRe(q)})`, 'ig'));
    return parts.map((p, i) => (i % 2 ? <mark key={`${key}-${i}`} className="xl-hit">{p}</mark> : p));
  };
  return text.split(EMAIL).map((part, i) => (i % 2
    ? <a key={i} href={`mailto:${part}`} className="xl-mail">{mark(part, i)}</a>
    : <Fragment key={i}>{mark(part, i)}</Fragment>));
}

function wordsIn(doc) {
  let n = 0;
  const add = (s) => { if (s) n += s.split(/\s+/).length; };
  doc.intro.forEach((b) => add(b.t));
  doc.sections.forEach((s) => s.blocks.forEach((b) => {
    add(b.t); add(b.sub);
    b.items?.forEach((it) => add(it.t));
    b.body?.forEach((x) => { add(x.p); x.list?.forEach((it) => add(it.t)); });
  }));
  return n;
}

// Rail entries: sections, or the clauses inside them for a short document
function railFor(doc) {
  return doc.sections.map((s) => ({
    id: s.id, n: s.n, h: s.h,
    kids: doc.railClauses ? s.blocks.map((b) => ({ id: clauseId(s, b.n), n: clauseNo(s, b.n), h: b.label })) : null,
  }));
}

/* ------------------------------------------------------------------ */
/* Pieces                                                               */
/* ------------------------------------------------------------------ */
function Seal({ small }) {
  return (
    <svg className={`xl-seal${small ? ' xl-seal--sm' : ''}`} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="xl-seal-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <text fontSize="10.5" letterSpacing="3.2" fontWeight="600" fill="currentColor">
        <textPath href="#xl-seal-ring">PRIMALONE NUTRITION · HYDERABAD · INDIA ·</textPath>
      </text>
      <path d="M60 44c-7 6-10 12-10 18a10 10 0 0 0 20 0c0-6-3-12-10-18Zm0 6v22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DocCard({ doc, minutes, count }) {
  return (
    <div className="xl-card" aria-label="Document details">
      <div className="xl-card__sheet xl-card__sheet--3" aria-hidden="true" />
      <div className="xl-card__sheet xl-card__sheet--2" aria-hidden="true" />
      <div className="xl-card__sheet">
        <div className="xl-card__top">
          <span className="xl-card__eyebrow">Primalone Nutrition Private Limited</span>
          <Seal />
        </div>
        <p className="xl-card__kind">{doc.kind}</p>
        <p className="xl-card__issued">{doc.issued}</p>
        <dl className="xl-card__meta">
          <div><dt>Effective</dt><dd>{doc.effective}</dd></div>
          <div><dt>Place</dt><dd>{doc.place}</dd></div>
          <div><dt>{doc.railClauses ? 'Clauses' : 'Sections'}</dt><dd>{count}</dd></div>
          <div><dt>Reading time</dt><dd>~{minutes} min</dd></div>
        </dl>
      </div>
    </div>
  );
}

function Glance({ slug }) {
  const g = glance[slug];
  if (!g) return null;
  return (
    <section className="xl-glance" aria-label="In short">
      <div className="shell">
        <div className="xl-glance__head">
          <span className="xl-kicker"><Icon name="info" size={15} /> In short</span>
          <p>A plain summary. The full text below is what applies.</p>
        </div>

        {g.kind === 'timeline' && (
          <div className="xl-time">
            <h2 className="xl-time__title">{g.title}</h2>
            <ol className="xl-time__track">
              {g.steps.map((s, i) => (
                <Reveal as="li" key={s.what} delay={i * 90} className="xl-time__step">
                  <span className="xl-time__dot" aria-hidden="true" />
                  <strong>{s.when}</strong>
                  <span>{s.what}</span>
                </Reveal>
              ))}
            </ol>
            <ul className="xl-time__foot">
              {g.foot.map((f) => (
                <li key={f.k}>
                  <Icon name={f.icon} size={18} />
                  <div><b>{f.k}</b><span><Rich text={f.v} /></span></div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {g.kind === 'cards' && (
          <ul className="xl-gcards">
            {g.cards.map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 80} className="xl-gcard">
                <span className="xl-gcard__icon"><Icon name={c.icon} size={20} /></span>
                <b>{c.k}</b>
                {c.v && <p><Rich text={c.v} /></p>}
                {c.chips && <div className="xl-chips">{c.chips.map((x) => <span key={x}>{x}</span>)}</div>}
              </Reveal>
            ))}
          </ul>
        )}

        {g.kind === 'stats' && (
          <ul className="xl-stats">
            {g.cards.map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 80} className="xl-stat">
                <span className="xl-stat__big">{c.big}{c.unit && <small>{c.unit}</small>}</span>
                <b>{c.k}</b>
                <p>{c.v}</p>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CopyLink({ id }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    const url = `${location.origin}${location.pathname}#${id}`;
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked: the hash still updates */ }
    history.replaceState(null, '', `#${id}`);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button type="button" className={`xl-copy${done ? ' is-done' : ''}`} onClick={copy} aria-label="Copy link to this clause">
      {done ? 'Copied' : '#'}
    </button>
  );
}

function Items({ items, tone, bullets, q }) {
  return (
    <ul className={`xl-items${tone ? ` xl-items--${tone}` : ''}${bullets ? ' xl-items--dots' : ''}`}>
      {items.map((it) => (
        <li key={(it.n || '') + it.t.slice(0, 24)}>
          {tone ? (
            <span className="xl-items__mark" aria-hidden="true"><Icon name={tone === 'yes' ? 'check' : 'close'} size={13} /></span>
          ) : it.n ? <span className="xl-items__n">{it.n}</span> : <span className="xl-items__dot" aria-hidden="true" />}
          <span><Rich text={it.t} q={q} /></span>
        </li>
      ))}
    </ul>
  );
}

function Clause({ sec, b, q }) {
  const id = clauseId(sec, b.n);
  return (
    <div id={id} className={`xl-cl${b.tone ? ` xl-cl--${b.tone}` : ''}`}>
      <div className="xl-cl__gut">
        <span className="xl-cl__n">{clauseNo(sec, b.n)}</span>
        <CopyLink id={id} />
      </div>
      <div className="xl-cl__body">
        {b.label && <p className="xl-cl__label">{b.label}</p>}
        <p>
          {b.lead && <strong className="xl-cl__lead"><Rich text={b.lead} q={q} />: </strong>}
          <Rich text={b.t} q={q} />
        </p>
        {b.items && <Items items={b.items} q={q} />}
        {b.body?.map((x, i) => (x.list
          ? <Items key={i} items={x.list} tone={b.tone} bullets={x.bullets} q={q} />
          : <p key={i}><Rich text={x.p} q={q} /></p>))}
      </div>
    </div>
  );
}

function Section({ sec, q }) {
  return (
    <section id={sec.id} className="xl-s" data-rail>
      <header className="xl-s__head">
        <span className="xl-s__num" aria-hidden="true">{sec.n.padStart(2, '0')}</span>
        <div>
          <span className="xl-s__sec">Section {sec.n}</span>
          <h2><Rich text={sec.h} q={q} /></h2>
        </div>
      </header>
      <div className="xl-s__blocks">
        {sec.blocks.map((b, i) => {
          if (b.sub) return <h3 key={i} className="xl-sub"><span>{b.n}</span><Rich text={b.sub} q={q} /></h3>;
          if (b.n) return <Clause key={b.n} sec={sec} b={b} q={q} />;
          return <p key={i} className="xl-para"><Rich text={b.t} q={q} /></p>;
        })}
        {sec.contacts && (
          <ul className="xl-contacts">
            {sec.contacts.map((c) => (
              <li key={c.label}>
                <span className="xl-contacts__k">{c.label}</span>
                <a href={`mailto:${c.email}`}>{c.email}<Icon name="arrow" size={15} /></a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reading state: active entry, per-entry progress, whole-doc progress  */
/* ------------------------------------------------------------------ */
function useReading(ids, articleRef, railRef, barRef) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(' ');
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = 140;
      let cur = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        const link = railRef.current?.querySelector(`[data-for="${id}"]`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= line) cur = id;
        const p = Math.min(1, Math.max(0, (line - r.top) / Math.max(r.height, 1)));
        link?.style.setProperty('--p', p.toFixed(3));
      });
      setActive(cur);
      const a = articleRef.current?.getBoundingClientRect();
      if (a && barRef.current) {
        const total = Math.max(a.height - innerHeight * 0.6, 1);
        barRef.current.style.setProperty('--p', Math.min(1, Math.max(0, -a.top / total)).toFixed(3));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

function Policy({ slug, doc }) {
  const rail = useMemo(() => railFor(doc), [doc]);
  const ids = useMemo(() => rail.flatMap((r) => (r.kids ? r.kids.map((k) => k.id) : [r.id])), [rail]);
  const titles = useMemo(() => Object.fromEntries(rail.flatMap((r) => (r.kids ? r.kids.map((k) => [k.id, `${k.n} · ${k.h}`]) : [[r.id, `${r.n}. ${r.h}`]]))), [rail]);
  const minutes = useMemo(() => Math.max(1, Math.round(wordsIn(doc) / 220)), [doc]);

  const articleRef = useRef(null);
  const railRef = useRef(null);
  const barRef = useRef(null);
  const active = useReading(ids, articleRef, railRef, barRef);

  // contents open beside the text on desktop, folded away on phones
  const [wide] = useState(() => window.matchMedia('(min-width: 992px)').matches);

  // Find in this policy
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim().length >= 2 ? query.trim() : '');
  const [hits, setHits] = useState(0);
  const [at, setAt] = useState(0);
  useLayoutEffect(() => {
    const marks = articleRef.current?.querySelectorAll('mark.xl-hit') ?? [];
    setHits(marks.length);
    setAt(0);
  }, [q]);
  useEffect(() => {
    const marks = articleRef.current?.querySelectorAll('mark.xl-hit');
    if (!marks?.length) return;
    marks.forEach((m, i) => m.classList.toggle('is-current', i === at));
    marks[at]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [at, hits, q]);
  const step = (d) => hits && setAt((i) => (i + d + hits) % hits);

  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  // Deep links (/terms#c-7-c) land on the clause after render
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, [slug]);

  return (
    <>
      <header className="x-hero xl-hero xl-hero--doc">
        <div className="shell xl-hero__grid">
          <div>
            <PolicyTabs />
            <p className="xl-kicker">{doc.kind}</p>
            <h1 className="x-h1 xl-title">{doc.title}<span className="is-accent">.</span></h1>
            <p className="x-lead">{doc.lead}</p>
            <div className="xl-hero__actions">
              <a href="#policy-text" className="pill" onClick={(e) => jump(e, 'policy-text')}>
                <span className="pill__label">Read the full policy</span>
                <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
              </a>
              <button type="button" className="xl-ghost" onClick={() => window.print()}>
                <Icon name="print" size={17} /> Print or save as PDF
              </button>
            </div>
          </div>
          <DocCard doc={doc} minutes={minutes} count={ids.length} />
        </div>
      </header>

      <Glance slug={slug} />

      <section className="xl-read" id="policy-text">
        <div className="shell xl-read__grid">
          <aside className="xl-rail" ref={railRef}>
            <div className="xl-find" role="search">
              <Icon name="search" size={17} />
              <input
                type="search" value={query} placeholder="Find in this policy"
                aria-label="Find in this policy"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') setQuery(''); }}
              />
              {q && (
                <div className="xl-find__nav">
                  <span aria-live="polite">{hits ? `${at + 1}/${hits}` : '0'}</span>
                  <button type="button" onClick={() => step(-1)} disabled={!hits} aria-label="Previous match"><Icon name="chevronUp" size={15} /></button>
                  <button type="button" onClick={() => step(1)} disabled={!hits} aria-label="Next match"><Icon name="chevronDown" size={15} /></button>
                </div>
              )}
            </div>

            <details className="xl-chap" open={wide}>
              <summary>Contents <span>{ids.length}</span></summary>
              <ol>
                {rail.map((r) => (
                  <li key={r.id}>
                    {r.kids ? (
                      <>
                        <a href={`#${r.id}`} className="xl-chap__group" onClick={(e) => jump(e, r.id)}>{r.n}. {r.h}</a>
                        <ol>
                          {r.kids.map((k) => (
                            <li key={k.id}>
                              <a href={`#${k.id}`} data-for={k.id} className={active === k.id ? 'is-on' : undefined} onClick={(e) => jump(e, k.id)}>
                                <span className="xl-chap__n">{k.n}</span>{k.h}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      <a href={`#${r.id}`} data-for={r.id} className={active === r.id ? 'is-on' : undefined} onClick={(e) => jump(e, r.id)}>
                        <span className="xl-chap__n">{r.n.padStart(2, '0')}</span>{r.h}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </aside>

          <article className="xl-text" ref={articleRef}>
            {doc.intro.length > 0 && (
              <div className="xl-pre">
                <span className="xl-s__sec">Preamble</span>
                {doc.intro.map((b) => (b.note
                  ? <p key={b.t.slice(0, 24)} className="xl-warn"><Icon name="info" size={18} /><span><Rich text={b.t} q={q} /></span></p>
                  : <p key={b.t.slice(0, 24)}><Rich text={b.t} q={q} /></p>))}
              </div>
            )}

            {doc.sections.map((s) => <Section key={s.id} sec={s} q={q} />)}

            <footer className="xl-end">
              <Seal small />
              <div>
                <p className="xl-end__t">End of {doc.kind}</p>
                <p>Effective {doc.effective} · {doc.place}</p>
              </div>
            </footer>

            <aside className="xl-help on-night">
              <h2 className="x-h3">Questions about this?</h2>
              <p>Search the answers or write to us. Include your order reference if it is about an order.</p>
              <Link to="/contact" className="pill pill--light">
                <span className="pill__label">Help &amp; contact</span>
                <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
              </Link>
            </aside>
          </article>
        </div>
      </section>

      <OtherPolicies slug={slug} />

      {/* Phones: where you are, how far through, back to top */}
      <div className="xl-mbar" ref={barRef} aria-hidden="true">
        <span className="xl-mbar__fill" />
        <span className="xl-mbar__t">{titles[active]}</span>
        <button type="button" tabIndex={-1} onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="chevronUp" size={16} /></button>
      </div>
    </>
  );
}

function OtherPolicies({ slug }) {
  return (
    <nav className="xl-next" aria-label="Other policies">
      <div className="shell">
        <p className="xl-kicker">Other policies</p>
        <ul>
          {tabs.filter(([k]) => k !== slug).map(([k, t, icon]) => (
            <li key={k}>
              <Link to={`/${k}`}>
                <span className="xl-next__ic"><Icon name={icon} size={18} /></span>
                <span className="xl-next__k">{docs[k]?.kind || `${t} Policy`}</span>
                <span className="xl-next__t">{t}</span>
                <Icon name="arrow" size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function PolicyTabs() {
  return (
    <nav className="xl-tabs" aria-label="Policies">
      {tabs.map(([key, title, icon]) => (
        <NavLink key={key} to={`/${key}`} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
          <Icon name={icon} size={15} /><span>{title}</span>
        </NavLink>
      ))}
    </nav>
  );
}

// Shipping: short policy with a delivery card, a checkout-to-door timeline and the policy points
const shipFacts = [
  ['Processing', '1–2 business days'],
  ['Payment', 'Online only'],
  ['Carrier', 'Confirmed at checkout'],
  ['Delivers to', 'India'],
];

function ShortPolicy({ page }) {
  return (
    <>
      <header className="x-hero xl-hero xl-hero--doc">
        <div className="shell xl-hero__grid">
          <div>
            <PolicyTabs />
            <p className="xl-kicker">Shipping Policy</p>
            <h1 className="x-h1 xl-title">{page.title}<span className="is-accent">.</span></h1>
            <p className="x-lead">{page.lead} What happens between checkout and your door, and who to ask if a parcel is late.</p>
            <div className="xl-hero__actions">
              <a href="#ship-policy" className="pill" onClick={(e) => { e.preventDefault(); document.getElementById('ship-policy')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                <span className="pill__label">Read the policy</span>
                <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
              </a>
              <Link to="/returns" className="xl-ghost"><Icon name="refresh" size={17} /> Returns &amp; refunds</Link>
            </div>
          </div>
          <div className="xl-card xl-card--ship" aria-label="Delivery at a glance">
            <div className="xl-card__sheet xl-card__sheet--3" aria-hidden="true" />
            <div className="xl-card__sheet xl-card__sheet--2" aria-hidden="true" />
            <div className="xl-card__sheet">
              <div className="xl-card__top">
                <span className="xl-card__eyebrow">Primalone Nutrition Private Limited</span>
                <Seal />
              </div>
              <div className="xl-ship__route" aria-hidden="true">
                <span><Icon name="box" size={18} /></span>
                <i />
                <span className="is-truck"><Icon name="truck" size={18} /></span>
                <i />
                <span><Icon name="check" size={18} /></span>
              </div>
              <p className="xl-card__kind">Delivery at a glance</p>
              <dl className="xl-card__meta">
                {shipFacts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
          </div>
        </div>
      </header>

      <Glance slug="shipping" />

      <section className="xl-body" id="ship-policy">
        <div className="shell xl-grid">
          <div>
            <p className="xl-kicker">The policy</p>
            <h2 className="xl-body__title">Three things to know</h2>
            <ol className="xl-clauses">
              {page.body.map((para, i) => (
                <Reveal as="li" key={para.slice(0, 28)} delay={i * 80} className="xl-clause">
                  <span className="xl-clause__n">{String(i + 1).padStart(2, '0')}</span>
                  <p>{para}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <aside className="xl-help on-night">
            <span className="xl-help__ic"><Icon name="mail" size={20} /></span>
            <h2 className="x-h3">Where is my order?</h2>
            <p>Write to us with your order reference and we will check with the carrier.</p>
            <Link to="/contact" className="pill pill--light">
              <span className="pill__label">Help &amp; contact</span>
              <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
            </Link>
          </aside>
        </div>
      </section>

      <OtherPolicies slug="shipping" />
    </>
  );
}

export default function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const doc = docs[slug];
  if (!doc && !legalPages[slug]) return <Navigate to="/" replace />;

  return (
    <div className="xp xl">
      {doc ? <Policy key={slug} slug={slug} doc={doc} /> : <ShortPolicy page={legalPages[slug]} />}
    </div>
  );
}

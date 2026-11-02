import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { contactPage, faqPage, faqSlug } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Reveal, SplitLines, Tbc } from '../components/ui/primitives.jsx';
import '../components/page/PageChrome.css';
import './ContactPage.css';

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: smooth(), block: 'start' });

// Highlights the search term inside a question or answer
function Mark({ text, term }) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>;
}

function Question({ item, open, onToggle, term }) {
  const id = faqSlug(item.q);
  return (
    <li id={id} className={`hq ${open ? 'is-open' : ''}`}>
      <h4>
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} onClick={onToggle}>
          <span><Mark text={item.q} term={term} /></span>
          <span className="hq__icon" aria-hidden="true"><Icon name="plus" size={18} /></span>
        </button>
      </h4>
      <div id={`${id}-a`} className="hq__a" role="region" aria-label={item.q}>
        <div><p><Mark text={item.a} term={term} /></p></div>
      </div>
    </li>
  );
}

function MessageForm() {
  const p = contactPage;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ topic: p.topics[0], name: '', email: '', order: '', message: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const needsOrder = form.topic === 'An order' || form.topic === 'Delivery';

  if (sent) {
    return (
      <div className="hc-thanks" role="status">
        <span className="hc-thanks__tick"><Icon name="check" size={30} /></span>
        <h3>{p.thanks.title}</h3>
        <p>{p.thanks.body}</p>
        <button type="button" onClick={() => { setSent(false); setForm({ ...form, message: '', order: '' }); }}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="hc-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <fieldset className="hc-topics">
        <legend>What is it about?</legend>
        <div>
          {p.topics.map((t) => (
            <label key={t} className={form.topic === t ? 'is-on' : ''}>
              <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="hc-row">
        <label className="hc-field">
          <input required name="name" autoComplete="name" placeholder=" " value={form.name} onChange={set('name')} />
          <span>{p.fields.name}</span>
        </label>
        <label className="hc-field">
          <input required type="email" name="email" autoComplete="email" placeholder=" " value={form.email} onChange={set('email')} />
          <span>{p.fields.email}</span>
        </label>
      </div>
      <div className={`hc-reveal ${needsOrder ? 'is-shown' : ''}`} aria-hidden={!needsOrder}>
        <div>
          <label className="hc-field">
            <input name="order" placeholder=" " value={form.order} onChange={set('order')} tabIndex={needsOrder ? 0 : -1} />
            <span>{p.fields.order}</span>
          </label>
        </div>
      </div>
      <label className="hc-field">
        <textarea required name="message" rows={5} placeholder=" " value={form.message} onChange={set('message')} maxLength={1200} />
        <span>{p.fields.message}</span>
        <small className="hc-field__count" aria-hidden="true">{form.message.length}/1200</small>
      </label>

      <button type="submit" className="pill pill--dark pill--block hc-send">
        <span className="pill__label">{p.fields.submit}</span>
        <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
      </button>
    </form>
  );
}

// Help & contact: a search-first hero, the FAQs with a topic rail, then the message form.
// /contact#faq-<question> opens and scrolls to that question; /contact#message to the form.
export default function ContactPage() {
  const p = contactPage;
  const { hash } = useLocation();
  const searchRef = useRef(null);
  const [term, setTerm] = useState('');
  const [topic, setTopic] = useState('all');
  const [open, setOpen] = useState(() => new Set([faqSlug(faqPage.groups[0].items[0].q)]));

  const reveal = (id) => {
    setTopic('all'); setTerm('');
    setOpen((s) => new Set(s).add(id));
    requestAnimationFrame(() => scrollToId(id));
  };
  useEffect(() => { if (hash.startsWith('#faq-')) reveal(hash.slice(1)); }, [hash]);

  const toggle = (id) => setOpen((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const q = term.trim().toLowerCase();
  const groups = useMemo(() => faqPage.groups
    .filter((g) => topic === 'all' || g.id === topic)
    .map((g) => ({ ...g, items: g.items.filter((it) => !q || `${it.q} ${it.a}`.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length), [topic, q]);
  const found = groups.reduce((n, g) => n + g.items.length, 0);
  const all = faqPage.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="ip hc">
      {/* ---- Hero: a centred help desk: title, search, three quick paths ---- */}
      <header className="hc-hero">

        <div className="shell hc-hero__inner">
          <SplitLines id="contact-title" as="h1" className="hc-hero__title" lines={[p.titleLines.join(' ')]} />
          <p className="hc-hero__lead">{p.lead}</p>

          <form className="hc-search" role="search" onSubmit={(e) => { e.preventDefault(); scrollToId('faq'); }}>
            <Icon name="search" size={20} />
            <label htmlFor="help-search" className="visually-hidden">Search the answers</label>
            <input ref={searchRef} id="help-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)}
              placeholder="Search, e.g. magnesium or delivery" autoComplete="off" />
            {term && <button type="button" className="hc-search__clear" onClick={() => { setTerm(''); searchRef.current?.focus(); }} aria-label="Clear search"><Icon name="close" size={16} /></button>}
            <button type="submit" className="hc-search__go">Search</button>
          </form>
          <p className="hc-search__hint" role="status">
            {q ? <>{found} {found === 1 ? 'answer' : 'answers'} found · <button type="button" onClick={() => scrollToId('faq')}>View</button></> : null}
          </p>

          <div className="hc-paths">
            <button type="button" className="hc-path" onClick={() => { setTopic('all'); scrollToId('faq'); }}>
              <span className="hc-path__icon"><Icon name="search" size={20} /></span>
              <span><b>Browse answers</b><small>{all} questions, by topic</small></span>
              <Icon name="arrow" size={16} className="hc-path__go" />
            </button>
            <button type="button" className="hc-path" onClick={() => { setTopic('orders'); setTerm(''); scrollToId('faq'); }}>
              <span className="hc-path__icon"><Icon name="doc" size={20} /></span>
              <span><b>Orders &amp; delivery</b><small>Payments, shipping, returns</small></span>
              <Icon name="arrow" size={16} className="hc-path__go" />
            </button>
            <button type="button" className="hc-path hc-path--dark" onClick={() => scrollToId('message')}>
              <span className="hc-path__icon"><Icon name="chat" size={20} /></span>
              <span><b>Write to us</b><small>Send us a message</small></span>
              <Icon name="arrow" size={16} className="hc-path__go" />
            </button>
          </div>
        </div>
      </header>

      {/* ---- FAQs ---- */}
      <section id="faq" className="hc-faq" aria-labelledby="faq-title">
        <div className="shell hc-faq__grid">
          <aside className="hc-rail">
            <h2 id="faq-title" className="hc-faq__title">{p.faqTitle}</h2>
            <nav className="hc-rail__topics" aria-label="Topics">
              {[{ id: 'all', label: 'All questions' }, ...faqPage.groups].map((g) => (
                <button key={g.id} type="button" aria-pressed={topic === g.id} className={topic === g.id ? 'is-on' : ''}
                  onClick={() => setTopic(g.id)}>
                  <span>{g.label}</span>
                  <small>{g.id === 'all' ? all : g.items.length}</small>
                </button>
              ))}
            </nav>
            <a className="hc-rail__cta on-night" href="#message" onClick={(e) => { e.preventDefault(); scrollToId('message'); }}>
              <span>Can’t find your answer?</span>
              <b>Write to us <Icon name="arrow" size={16} /></b>
            </a>
          </aside>

          <div className="hc-faq__list">
            {q && (
              <p className="hc-faq__found" role="status">
                {found} {found === 1 ? 'result' : 'results'} for “{term.trim()}”
                <button type="button" onClick={() => setTerm('')}>Clear</button>
              </p>
            )}
            {groups.length === 0 && (
              <div className="hc-faq__none">
                <p>No answers match that. Try another word, or write to us.</p>
                <button type="button" className="text-link" onClick={() => scrollToId('message')}>Write to us</button>
              </div>
            )}
            {groups.map((g) => (
              <div key={g.id} className="hc-group">
                <h3 className="hc-group__title">{g.label}</h3>
                <ul>
                  {g.items.map((it) => {
                    const id = faqSlug(it.q);
                    return <Question key={id} item={it} term={q ? term.trim() : ''} open={open.has(id) || !!q} onToggle={() => toggle(id)} />;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Write to us ---- */}
      <section id="message" className="hc-msg" aria-labelledby="message-title">
        <div className="shell hc-msg__grid">
          <div className="hc-msg__copy">
            <SplitLines id="message-title" className="hc-msg__title" lines={p.formTitleLines} accentLast />
            <p className="hc-msg__lead">{p.formLead}</p>
            <ol className="hc-steps">
              {p.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="hc-steps__n" aria-hidden="true">{i + 1}</span>
                  <div><b>{s.title}</b><p>{s.body}</p></div>
                </li>
              ))}
            </ol>
            <div className="hc-msg__mail">
              <Icon name="mail" size={20} />
              {p.email ? <a href={`mailto:${p.email}`}>{p.email}</a> : <span>Support email <Tbc /></span>}
            </div>
            <p className="hc-msg__medical"><Icon name="info" size={16} />{p.medical}</p>
          </div>
          <Reveal className="hc-card">
            <MessageForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

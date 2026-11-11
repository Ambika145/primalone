import { useEffect, useRef, useState } from 'react';
import { aboutPage } from '../data/pages.js';
import { products } from '../data/content.js';
import Icon from '../components/ui/Icon.jsx';
import { Img, Reveal, SplitLines } from '../components/ui/primitives.jsx';
import { PageCta, SecHead } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import { GapSection, PhilosophySection, PlateSection, RangeSection, TogetherSection } from './AboutSections.jsx';
import './AboutPage.css';

// The story splits where PrimalOne's question begins; that question becomes the pull quote.
const SPLIT = 'PrimalOne started with a different question:';
// The cabinet: two crowded shelves of mismatched bottles. The four needs the story names are
// labelled; the rest is the clutter that builds up around them. [width, height, cap colour, label]
const shelves = [
  [[46, 104, '#c9773c', 'Energy'], [34, 70, '#8a6f9c'], [62, 78, '#6f8f5a', 'Gut'], [30, 92, '#c7a04a'], [40, 60, '#b45a4a']],
  [[38, 64, '#7a8a6a'], [44, 96, '#5b6b8c', 'Sleep'], [32, 58, '#d08a5a'], [56, 84, '#b4875a', 'Stress']],
];
// Questions the cabinet leaves open
const doubts = ['Morning?', 'With food?', 'Before bed?'];
// The words that carry each belief, set in gold
const beliefKeys = [['clearer'], ['Timing'], ['simple', 'kept'], ['clarity']];

// Marks the given words inside a sentence (whole words, case-sensitive as written)
function Highlight({ text, words }) {
  const parts = text.split(new RegExp(`\\b(${words.join('|')})\\b`));
  return parts.map((part, i) => (words.includes(part) ? <mark key={i} className="xa-hl">{part}</mark> : part));
}

export default function AboutPage() {
  const p = aboutPage;
  const cut = p.story.body.indexOf(SPLIT);
  const before = p.story.body.slice(0, cut).trim();
  const after = p.story.body.slice(cut).trim();
  const question = 'What if the order mattered more than the number of products?';

  // The belief nearest the middle of the screen is the one lit up
  const beliefsRef = useRef(null);
  const [activeBelief, setActiveBelief] = useState(0);
  useEffect(() => {
    const items = [...(beliefsRef.current?.children || [])];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveBelief(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="xp xa">
      {/* ---- Hero: an editorial statement with product photos set into the words ---- */}
      <header className="x-hero xa-hero">
        <div className="shell xa-hero__inner">
          <h1 id="about-title" className="xa-hero__title">
            <span className="xa-hero__line">
              <span className="xa-w" style={{ '--n': 0 }}>Nutrition</span>{' '}
              <span className="xa-chipimg" style={{ '--n': 1 }} aria-hidden="true"><Img name="origin-scoop" alt="" sizes="200px" priority /></span>{' '}
              <span className="xa-w" style={{ '--n': 2 }}>should</span>
            </span>{' '}
            <span className="xa-hero__line is-accent">
              <span className="xa-w" style={{ '--n': 3 }}>evolve</span>{' '}
              <span className="xa-chipimg xa-chipimg--b" style={{ '--n': 4 }} aria-hidden="true"><Img name="restore-evening" alt="" sizes="200px" priority /></span>{' '}
              <span className="xa-w" style={{ '--n': 5 }}>as you do.</span>
            </span>
          </h1>
          <p className="xa-hero__lead">{p.lead}</p>
        </div>
      </header>

      {/* ---- The story: the question as a statement, then the photo beside two chapters ---- */}
      <section className="x-sec xa-story">
        <div className="shell">
          <Reveal className="xa-story__top">
            <h2 className="x-h2">{p.story.title}<span className="is-accent">.</span></h2>
            <blockquote className="xa-quote"><p>{question}</p></blockquote>
          </Reveal>
          <div className="xa-story__grid">
            <Reveal className="xa-story__img">
              <Img name="ritual-set" alt="The Origin and Restore jars side by side with a walnut scoop" sizes="(min-width: 992px) 42vw, 90vw" />
            </Reveal>
            <div className="xa-chapters">
              <Reveal delay={100} className="xa-chapter">
                <h3 className="x-h3">The problem</h3>
                <p><Highlight text={before} words={['energy', 'gut', 'sleep', 'stress']} /></p>
              </Reveal>
              <Reveal delay={200} className="xa-chapter xa-chapter--answer on-night">
                <h3 className="x-h3">The question</h3>
                <p><Highlight text={after} words={['Origin', 'Restore']} /></p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The evidence, then where the gap opens and where we fit ---- */}
      <PlateSection />
      <GapSection />

      {/* ---- Cabinet vs sequence ---- */}
      <section className="x-sec x-sec--sand xa-vs">
        <div className="shell">
          <SecHead title="Fewer bottles." accent="Clearer days." center />
          <div className="xa-vs__grid">
            <Reveal className="xa-vs__card xa-vs__card--cab">
              <h3 className="x-h3">The cabinet</h3>
              <p>One thing for each need. Few designed to work together.</p>
              <div className="xa-cab" aria-label="A cabinet crowded with a bottle each for energy, gut, sleep and stress">
                {shelves.map((row, r) => (
                  <div key={r} className="xa-cab__shelf">
                    {row.map(([w, h, cap, label], i) => (
                      <span key={i} className={`xa-b ${label ? 'is-named' : ''}`}
                        style={{ '--w': `${w}px`, '--h': `${h}px`, '--cap': cap, '--i': r * 5 + i }}>
                        <i className="xa-b__cap" />
                        <i className="xa-b__body">{label && <em>{label}</em>}</i>
                      </span>
                    ))}
                    {r === 1 && <span className="xa-b xa-b--fallen" style={{ '--w': '30px', '--h': '62px', '--cap': '#9c8f78', '--i': 10 }}><i className="xa-b__cap" /><i className="xa-b__body" /></span>}
                  </div>
                ))}
                {doubts.map((d, i) => <span key={d} className={`xa-doubt xa-doubt--${i}`} style={{ '--i': i }}>{d}</span>)}
              </div>
            </Reveal>
            <span className="xa-vs__arrow" aria-hidden="true"><Icon name="arrow" size={24} /></span>
            <Reveal delay={120} className="xa-vs__card xa-vs__card--seq on-night">
              <h3 className="x-h3">The sequence</h3>
              <p>Two products that do not fight each other.</p>
              <ul className="xa-pair">
                {['origin', 'restore'].map((id) => (
                  <li key={id}>
                    <img src={`/img/${id}-turn-poster.webp`} alt="" width="72" height="72" />
                    <b>{products[id].name}</b>
                  </li>
                ))}
              </ul>
              {/* morning to evening: a gold line draws from Origin to Restore */}
              <div className="xa-flow" aria-hidden="true"><span>Morning</span><i /><span>Evening</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Beliefs ---- */}
      <section className="x-sec x-sec--forest on-night xa-beliefs">
        <div className="shell">
          <div className="xa-beliefs__grid">
            <div className="xa-beliefs__head">
              <h2 className="x-h2">What we <span className="is-accent">believe.</span></h2>
              <p className="xa-beliefs__lead">Four ideas behind everything we make.</p>
            </div>
            <ol ref={beliefsRef} className="xa-manifesto">
              {p.beliefs.map((b, i) => (
                <li key={b} data-i={i} className={i === activeBelief ? 'is-on' : ''}>
                  <p><Highlight text={b} words={beliefKeys[i]} /></p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- Ingredient philosophy ---- */}
      <PhilosophySection />

      {/* ---- The range: what each scoop supports, then the two together ---- */}
      <RangeSection />
      <TogetherSection />

      <PageCta title="Start with clarity." body="One morning scoop. An optional evening. Nothing more to begin." image="ritual-duo"
        actions={[{ label: 'Shop the sequence', href: '/shop' }, { label: 'Contact', href: '/contact' }]} />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { sciencePage } from '../data/pages.js';
import { footer } from '../data/content.js';
import Icon from '../components/ui/Icon.jsx';
import { Img, Reveal, SplitLines } from '../components/ui/primitives.jsx';
import { PageCta, SecHead } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import './SciencePage.css';

const qualityIcons = ['check', 'doc', 'search', 'leaf'];

// Science: the four modules scroll past while one framed image holds still and changes with them.
export default function SciencePage() {
  const p = sciencePage;
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const items = [...(listRef.current?.querySelectorAll('.xc-mod') || [])];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="xp xc">
      {/* ---- Hero ---- */}
      <header className="x-hero xc-hero on-night">
        <div className="shell xc-hero__grid">
          <div>
            <SplitLines id="sci-title" as="h1" className="x-h1" lines={p.titleLines} accentLast />
            <Reveal as="p" delay={120} className="x-lead">{p.sub}</Reveal>
            <Reveal delay={200} className="xc-hero__index">
              {p.modules.map((m) => <a key={m.n} href={`#mod-${m.n}`}><span>{m.n}</span>{m.title}</a>)}
            </Reveal>
          </div>
          <Reveal className="xc-hero__media" aria-hidden="true">
            <Img name={p.hero} alt="" sizes="(min-width: 992px) 42vw, 90vw" priority />
          </Reveal>
        </div>
      </header>

      {/* ---- Modules with a sticky image ---- */}
      <section className="xc-story">
        <div className="shell xc-story__grid">
          <div className="xc-story__media" aria-hidden="true">
            <div className="xc-story__frame">
              {p.modules.map((m, i) => (
                <div key={m.n} className={`xc-story__img ${i === active ? 'is-on' : ''}`}>
                  <Img name={m.image} alt="" sizes="(min-width: 992px) 44vw, 0px" />
                </div>
              ))}
              <span className="xc-story__count">{p.modules[active].n} / {String(p.modules.length).padStart(2, '0')}</span>
              <span className="xc-story__window">{p.modules[active].tone === 'night' ? 'Evening window' : 'Morning window'}</span>
            </div>
          </div>
          <ol ref={listRef} className="xc-story__list">
            {p.modules.map((m, i) => (
              <li key={m.n} id={`mod-${m.n}`} data-i={i} className={`xc-mod ${i === active ? 'is-on' : ''}`}>
                <div className="xc-mod__img"><Img name={m.image} alt="" sizes="90vw" /></div>
                <span className="xc-mod__n">{m.n}</span>
                <h2 className="x-h2">{m.title}</h2>
                <p className="x-body">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Quality ---- */}
      <section className="x-sec x-sec--sand xc-quality">
        <div className="shell">
          <SecHead title="Built for" accent="daily use." lead="What we hold ourselves to, for products you take every day." />
          <ul className="xc-quality__grid">
            {p.quality.map((q, i) => (
              <Reveal as="li" key={q} delay={i * 80} className="xc-q">
                <span className="xc-q__icon"><Icon name={qualityIcons[i]} size={22} /></span>
                <span className="xc-q__t">{q}</span>
              </Reveal>
            ))}
            <Reveal as="li" delay={320} className="xc-q xc-q--wide on-night">
              <span className="xc-q__label">Where it is made</span>
              <p>{footer.manufacturer}</p>
            </Reveal>
          </ul>
        </div>
      </section>

      <PageCta title="See how it fits a day." body="The science is in the timing. The sequence puts it into practice." image="ritual-duo"
        actions={[{ label: p.cta.label, href: p.cta.href }, { label: 'Read the journal', href: '/journal' }]} />
    </div>
  );
}

import { sequencePage } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Button, Img, Reveal, SplitLines } from '../components/ui/primitives.jsx';
import { PageCta, SecHead } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import './SequencePage.css';

// The rule, as two if/then lines (both sentences are from rule.body)
const ifThen = [
  { if: 'If you eat breakfast', then: 'take Origin in the morning.', tone: 'am' },
  { if: 'If you want recovery support at night', then: 'take Restore in the evening.', tone: 'pm' },
];
// Which windows each routine uses: [morning, evening]
const routineDots = [[true, false], [true, true], [false, false]];

export default function SequencePage() {
  const p = sequencePage;
  // Pulled out of whyOrder.body for the magnesium callout
  const mg = 'Magnesium is kept in the evening product so the daily supplemental total stays within common guidance when Origin is the only other product used.';

  return (
    <div className="xp xq">
      {/* ---- Hero: title beside a two-photo composition (morning over evening) ---- */}
      <header className="x-hero xq-hero">
        <div className="shell xq-hero__grid">
          <div>
            <SplitLines id="seq-title" as="h1" className="x-h1" lines={p.titleLines} accentLast />
            <Reveal as="p" delay={120} className="x-lead">{p.sub}</Reveal>
          </div>
          <div className="xq-hero__art" aria-hidden="true">
            <Reveal className="xq-hero__photo xq-hero__photo--am"><Img name={p.morning} alt="" sizes="(min-width: 992px) 30vw, 70vw" priority /></Reveal>
            <Reveal delay={160} className="xq-hero__photo xq-hero__photo--pm"><Img name={p.evening} alt="" sizes="(min-width: 992px) 24vw, 55vw" /></Reveal>
            <span className="xq-hero__never">Never at once</span>
          </div>
        </div>
      </header>

      {/* ---- The simple rule ---- */}
      <section className="x-sec xq-rule">
        <div className="shell">
          <SecHead title={p.rule.title} lead={p.rule.body} />
          <div className="xq-ifs">
            {ifThen.map((r, i) => (
              <Reveal key={r.if} delay={i * 120} className={`xq-if xq-if--${r.tone}`}>
                <span className="xq-if__if">{r.if}</span>
                <span className="xq-if__arrow" aria-hidden="true"><Icon name="arrow" size={22} /></span>
                <span className="xq-if__then">{r.then}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={240} className="xq-rule__chips">
            <span><Icon name="close" size={15} />Never taken together</span>
            <span><Icon name="moon" size={15} />Restore is optional</span>
            <span><Icon name="check" size={15} />Nothing more needed to start</span>
          </Reveal>
        </div>
      </section>

      {/* ---- Two windows: a full-bleed diptych ---- */}
      <section className="xq-diptych" aria-label="Morning and evening">
        {p.windows.map((w, i) => (
          <article key={w.id} className={`xq-win xq-win--${w.tone}`}>
            <Img name={w.image} alt="" sizes="(min-width: 768px) 50vw, 100vw" />
            <Reveal delay={i * 120} className="xq-win__card">
              <span className="x-pill">{w.kicker}</span>
              <h2 className="xq-win__name">{w.name}</h2>
              <p>{w.body}</p>
              <Button href={w.href} variant={w.tone === 'night' ? 'light' : 'dark'}>{w.cta}</Button>
            </Reveal>
          </article>
        ))}
      </section>

      {/* ---- Why this order ---- */}
      <section className="x-sec xq-why">
        <div className="shell xq-why__grid">
          <Reveal>
            <h2 className="x-h2">{p.whyOrder.title}<span className="is-accent">.</span></h2>
            <p className="x-body xq-why__body">{p.whyOrder.body}</p>
          </Reveal>
          <Reveal delay={120} className="xq-mg">
            <span className="xq-mg__sym" aria-hidden="true">Mg</span>
            <h3 className="x-h3">Magnesium lives in the evening.</h3>
            <p>{mg}</p>
            <p className="xq-mg__foot">The intelligence is in the timing, not in adding more products.</p>
          </Reveal>
        </div>
      </section>

      {/* ---- Assess · Sequence · Adapt ---- */}
      <section className="x-sec x-sec--night on-night xq-asa">
        <div className="shell">
          <SecHead title={p.asa.title} lead={p.asa.body} center />
          <ol className="xq-asa__steps">
            {p.asaSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 140} className="xq-asa__step">
                <span className="xq-asa__n" aria-hidden="true">{s.n}</span>
                <h3 className="x-h3">{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Three ways a day can go ---- */}
      <section className="x-sec x-sec--sand xq-days">
        <div className="shell">
          <SecHead title="Three ways" accent="a day can go." lead="Real days differ. The sequence bends with them." />
          <ol className="xq-days__grid">
            {p.routines.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 110} className="xq-day">
                <div className="xq-day__bar" aria-hidden="true">
                  <span className={`xq-day__slot ${routineDots[i][0] ? 'is-am' : 'is-off'}`}>{routineDots[i][0] ? 'Origin' : 'Skip'}</span>
                  <span className="xq-day__line" />
                  <span className={`xq-day__slot ${routineDots[i][1] ? 'is-pm' : 'is-off'}`}>{routineDots[i][1] ? 'Restore' : 'Skip'}</span>
                </div>
                <h3 className="x-h3">{r.title}</h3>
                <p>{r.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <PageCta title={p.closing} image="ritual-duo"
        actions={[{ label: p.primary, href: '/products/origin' }, { label: p.secondary, href: '/products/restore' }]} />
    </div>
  );
}

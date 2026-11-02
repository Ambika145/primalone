import { useState } from 'react';
import { Link } from 'react-router-dom';
import { journalPage } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Img, Reveal, SplitLines } from '../components/ui/primitives.jsx';
import { PageCta, readTime } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import './JournalPage.css';

// Journal: a magazine front — topic filter, one feature, then a card grid.
export default function JournalPage() {
  const p = journalPage;
  const topics = ['All', ...new Set(p.articles.map((a) => a.topic))];
  const [topic, setTopic] = useState('All');
  const list = p.articles.filter((a) => topic === 'All' || a.topic === topic);
  const [featured, ...rest] = list;

  return (
    <div className="xp xj">
      <header className="x-hero xj-hero">
        <div className="shell xj-hero__grid">
          <SplitLines id="journal-title" as="h1" className="x-h1" lines={p.titleLines} accentLast />
          <div>
            <Reveal as="p" delay={120} className="x-lead">{p.sub}</Reveal>
            <Reveal delay={180} className="xj-chips" role="tablist" aria-label="Topics">
              {topics.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={topic === t} className={topic === t ? 'is-on' : ''} onClick={() => setTopic(t)}>
                  {t}
                </button>
              ))}
            </Reveal>
          </div>
        </div>
      </header>

      <section className="xj-body">
        <div className="shell">
          {featured && (
            <Reveal key={featured.slug}>
              <Link to={`/journal/${featured.slug}`} className="xj-feature">
                <div className="xj-feature__media">
                  <Img name={featured.image} alt="" sizes="(min-width: 992px) 58vw, 100vw" priority />
                  <span className="xj-feature__flag">Featured</span>
                </div>
                <div className="xj-feature__copy">
                  <span className="xj-meta">{featured.topic} · {readTime(featured.body)} min read</span>
                  <h2 className="x-h2">{featured.title}</h2>
                  <p>{featured.open}</p>
                  <span className="xj-read">Read the article <Icon name="arrow" size={16} /></span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="xj-grid">
              {rest.map((a, i) => (
                <Reveal key={a.slug} delay={i * 90}>
                  <Link to={`/journal/${a.slug}`} className="xj-card">
                    <div className="xj-card__media"><Img name={a.image} alt="" sizes="(min-width: 992px) 30vw, (min-width: 576px) 46vw, 100vw" /></div>
                    <span className="xj-meta">{a.topic} · {readTime(a.body)} min read</span>
                    <h3 className="x-h3">{a.title}</h3>
                    <p>{a.open}</p>
                    <span className="xj-read">Read <Icon name="arrow" size={15} /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <PageCta title="Read less. Take what matters." body="The whole method fits on one page." image="origin-stir"
        actions={[{ label: 'See the sequence', href: '/sequence' }, { label: 'Shop', href: '/shop' }]} />
    </div>
  );
}

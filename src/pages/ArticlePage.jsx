import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { journalPage } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Img, Reveal } from '../components/ui/primitives.jsx';
import { PageCta, readTime } from '../components/page/Inner.jsx';
import '../components/page/Inner.css';
import './ArticlePage.css';

// Reading progress across the article body
function useProgress(id) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, (innerHeight * .4 - r.top) / r.height)));
    };
    const on = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(frame); };
  }, [id]);
  return p;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const all = journalPage.articles;
  const idx = all.findIndex((a) => a.slug === slug);
  const article = all[idx];
  const progress = useProgress('article-body');
  if (!article) return <Navigate to="/journal" replace />;
  const others = all.filter((a) => a.slug !== slug).slice(0, 3);
  const [lead, ...rest] = article.body;

  return (
    <article className="xp xr">
      <div className="xr-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <header className="x-hero xr-hero on-night">
        <Img name={article.image} alt="" sizes="100vw" priority className="xr-hero__img" />
        <div className="shell xr-hero__copy">
          <Link to="/journal" className="xr-back"><Icon name="arrow" size={15} />Journal</Link>
          <span className="xr-meta">{article.topic} · {readTime(article.body)} min read</span>
          <h1 className="x-h1 xr-title">{article.title}</h1>
        </div>
      </header>

      <section className="xr-body" id="article-body">
        <div className="shell xr-body__grid">
          <aside className="xr-aside">
            <span className="xr-aside__label">In this article</span>
            <p>{article.topic}</p>
            <span className="xr-aside__label">Products</span>
            <p><Link to="/products/origin">Origin</Link> · <Link to="/products/restore">Restore</Link></p>
          </aside>
          <div className="xr-text">
            <Reveal as="p" className="xr-lead">{lead}</Reveal>
            {rest.map((para) => <Reveal key={para.slice(0, 32)} as="p" className="xr-p">{para}</Reveal>)}
          </div>
        </div>
      </section>

      <section className="x-sec x-sec--sand xr-more">
        <div className="shell">
          <h2 className="x-h2">Keep reading<span className="is-accent">.</span></h2>
          <div className="xr-more__grid">
            {others.map((a) => (
              <Link key={a.slug} to={`/journal/${a.slug}`} className="xr-mcard">
                <div className="xr-mcard__img"><Img name={a.image} alt="" sizes="(min-width: 992px) 26vw, 80vw" /></div>
                <span>{a.topic}</span>
                <b>{a.title}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCta title="Put it into practice." body="The whole method fits on one page." image="ritual-duo"
        actions={[{ label: 'See the sequence', href: '/sequence' }, { label: 'All journal', href: '/journal' }]} />
    </article>
  );
}

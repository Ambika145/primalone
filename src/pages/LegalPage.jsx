import { Link, Navigate, NavLink, useLocation } from 'react-router-dom';
import { legalPages } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Reveal } from '../components/ui/primitives.jsx';
import '../components/page/Inner.css';
import './LegalPage.css';

// One sentence under each policy title
const intro = {
  shipping: 'How orders are processed and delivered.',
  returns: 'What to do if something is not right.',
  privacy: 'What we collect, and what we never do with it.',
  terms: 'The ground rules for using this site.',
};

// Policies: tabs across all four, numbered clauses, and a help card.
export default function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const page = legalPages[slug];
  if (!page) return <Navigate to="/" replace />;

  return (
    <div className="xp xl">
      <header className="x-hero xl-hero">
        <div className="shell">
          <nav className="xl-tabs" aria-label="Policies">
            {Object.entries(legalPages).map(([key, v]) => (
              <NavLink key={key} to={`/${key}`} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>{v.title}</NavLink>
            ))}
          </nav>
          <h1 className="x-h1 xl-title">{page.title}<span className="is-accent">.</span></h1>
          <p className="x-lead">{intro[slug]}</p>
        </div>
      </header>

      <section className="xl-body">
        <div className="shell xl-grid">
          <ol className="xl-clauses">
            {page.body.map((para, i) => (
              <Reveal as="li" key={para.slice(0, 28)} delay={i * 80} className="xl-clause">
                <span className="xl-clause__n">{String(i + 1).padStart(2, '0')}</span>
                <p>{para}</p>
              </Reveal>
            ))}
          </ol>
          <aside className="xl-help on-night">
            <h2 className="x-h3">Questions about this?</h2>
            <p>Search the answers or write to us. Include your order reference if it is about an order.</p>
            <Link to="/contact" className="pill pill--light">
              <span className="pill__label">Help &amp; contact</span>
              <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

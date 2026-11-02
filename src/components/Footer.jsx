import { Link } from 'react-router-dom';
import { footer } from '../data/content.js';
import Icon from './ui/Icon.jsx';
import { Tbc } from './ui/primitives.jsx';
import './Footer.css';

function FootLink({ href, children }) {
  if (href.startsWith('#')) return <a href={href}>{children}</a>;
  return <Link to={href}>{children}</Link>;
}

export default function Footer() {
  return (
    <footer className="site-footer on-night">
      <div className="shell site-footer__shell">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo" aria-label="PrimalOne home">
              <img src="/img/logo-wordmark-light.png" alt="" width="520" height="116" loading="lazy" />
            </Link>
            <p className="site-footer__tagline">{footer.tagline}</p>
            <p className="site-footer__trust mono">{footer.trust}</p>
          </div>

          <div className="site-footer__navs">
            {footer.columns.map((col) => (
              <nav key={col.title} className="site-footer__col" aria-label={col.title}>
                <p className="site-footer__col-title mono">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FootLink href={l.href}>{l.label}</FootLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Social: round icon buttons in their own column beside Company */}
            <div className="site-footer__col site-footer__follow">
              <p className="site-footer__col-title mono">Follow us</p>
              <ul className="site-footer__icons">
                {footer.socials.map((s) => (
                  <li key={s.id}>
                    <a href={s.href} aria-label={`PrimalOne on ${s.label}`} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      <Icon name={s.id} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="site-footer__follow-line">{footer.socialLine}</p>
              {footer.socials.some((s) => s.href === '#') && <Tbc>Links to confirm</Tbc>}
            </div>
          </div>
        </div>

        <p className="site-footer__made">{footer.manufacturer}</p>
        <div className="site-footer__meta">
          <span>{footer.fssai}</span>
          <span>{footer.payments}</span>
        </div>

        <p className="site-footer__disc">{footer.disclaimer}</p>


        <div className="site-footer__bottom">
          <span>{footer.legal}</span>
          <span className="site-footer__legal-links"><Link to="/terms">Terms of use</Link><Link to="/privacy">Privacy</Link></span>
        </div>
      </div>

      <img
        className="site-footer__mark"
        src="/img/logo-mark-light.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        width="192"
        height="279"
      />
    </footer>
  );
}

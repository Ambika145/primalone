import { footer } from '../data/content.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer on-night">
      <div className="shell site-footer__shell">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a href="#top" className="site-footer__logo" aria-label="PrimalOne, back to top">
              <img src="/img/logo-wordmark-light.png" alt="" width="520" height="116" loading="lazy" />
            </a>
            <p className="site-footer__tagline">{footer.tagline}</p>
          </div>

          <div className="site-footer__navs">
            {footer.columns.map((col) => (
              <nav key={col.title} className="site-footer__col" aria-label={col.title}>
                <p className="site-footer__col-title mono">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="site-footer__meta">
          <span>{footer.manufacturer}</span>
          <span>{footer.fssai}</span>
          <span>{footer.payments}</span>
        </div>

        <p className="site-footer__disc">{footer.disclaimer}</p>

        <div className="site-footer__bottom">
          <span>{footer.legal}</span>
          <span>{footer.taxes}</span>
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

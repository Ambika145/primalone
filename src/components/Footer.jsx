import { useState } from 'react';
import { Link } from 'react-router-dom';
import { footer } from '../data/content.js';
import Icon from './ui/Icon.jsx';
import { Tbc } from './ui/primitives.jsx';
import './Footer.css';

function FootLink({ href, children }) {
  if (href.startsWith('http')) return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
  if (href.startsWith('#')) return <a href={href}>{children}</a>;
  return <Link to={href}>{children}</Link>;
}

// Payment marks drawn as small inline SVG badges, so they stay sharp and need no extra files.
const payLogos = {
  upi: { label: 'UPI', svg: (
    <svg viewBox="0 0 64 24"><path d="M8 4l5 8-5 8z" fill="#f47c20" /><path d="M13 4l5 8-5 8z" fill="#0b8a43" /><text x="22" y="17.5" fontFamily="Arial, sans-serif" fontWeight="800" fontStyle="italic" fontSize="15" fill="#5f6368">UPI</text></svg>
  ) },
  visa: { label: 'Visa', svg: (
    <svg viewBox="0 0 64 24"><text x="32" y="18" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="17" letterSpacing="-.5" fill="#1a1f71">VISA</text></svg>
  ) },
  mastercard: { label: 'Mastercard', svg: (
    <svg viewBox="0 0 64 24"><circle cx="26" cy="12" r="9" fill="#eb001b" /><circle cx="38" cy="12" r="9" fill="#f79e1b" /><path d="M32 5.3a9 9 0 0 1 0 13.4 9 9 0 0 1 0-13.4z" fill="#ff5f00" /></svg>
  ) },
  rupay: { label: 'RuPay', svg: (
    <svg viewBox="0 0 64 24"><text x="4" y="17" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#1b3f8f">RuPay</text><path d="M50 6l6 6-6 6z" fill="#f47c20" /><path d="M54 6l6 6-6 6z" fill="#0b8a43" /></svg>
  ) },
  netbanking: { label: 'Net banking', svg: (
    <svg viewBox="0 0 84 24"><path d="M6 9.5L13 5l7 4.5zM7.5 11h2v5h-2zM12 11h2v5h-2zM16.5 11h2v5h-2zM6 17h14v2H6z" fill="#14532d" /><text x="24" y="16" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10.5" fill="#1f2937">Net banking</text></svg>
  ) },
};

function PayLogo({ id }) {
  const l = payLogos[id];
  if (!l) return null;
  return <span className={`site-footer__pay-logo site-footer__pay-logo--${id}`} role="img" aria-label={l.label} title={l.label}>{l.svg}</span>;
}

// "Designed & developed by" credit: the logo, or the name if the logo fails to load.
function Credit() {
  const c = footer.credit;
  const [logoOk, setLogoOk] = useState(true);
  const inner = (
    <>
      <span>Designed &amp; developed by</span>
      {logoOk
        ? <img src={c.logo} alt={c.label} width="184" height="78" loading="lazy" onError={() => setLogoOk(false)} />
        : <b>{c.label}</b>}
    </>
  );
  return c.href
    ? <a className="site-footer__credit" href={c.href} target="_blank" rel="noreferrer" aria-label={`Designed and developed by ${c.label}`}>{inner}</a>
    : <span className="site-footer__credit">{inner}</span>;
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
        <div className="site-footer__pay" aria-label="Payment methods we accept">
          {footer.payments.map((id) => <PayLogo key={id} id={id} />)}
        </div>

        <div className="site-footer__bottom">
          <span>{footer.legal}</span>
          <span className="site-footer__legal-links"><Link to="/terms">Terms of use</Link><Link to="/privacy">Privacy</Link></span>
          <Credit />
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

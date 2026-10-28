import { useEffect, useRef, useState } from 'react';
import { navLinks } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import Icon from './ui/Icon.jsx';
import { Button } from './ui/primitives.jsx';
import './Navbar.css';

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY, frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const goingDown = y > last + 4, goingUp = y < last - 4;
      setState((s) => ({
        scrolled: y > 24,
        hidden: y > 520 && goingDown ? true : goingUp || y <= 520 ? false : s.hidden,
      }));
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return state;
}

// Highlights the nav item for whichever section currently holds the middle of the screen.
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = ['hero', 'origin', 'restore', 'why', 'how', 'benefits', 'learn', 'signal', 'shop', 'faq'];

export default function Navbar() {
  const { scrolled, hidden } = useScrollState();
  const active = useActiveSection(sectionIds);
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', menuOpen);
    if (!menuOpen) return;
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); menuBtnRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close the overlay if the viewport grows to desktop while it is open.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Unlock the page first, then scroll on the next frame; scrolling while body is locked is unreliable.
  const closeAndGo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', href);
    }));
  };

  const isActive = (link) => (link.href === '#origin' && active === 'origin')
    || (link.href === '#restore' && active === 'restore')
    || (link.href === '#how' && active === 'how')
    || (link.href === '#learn' && active === 'learn')
    || (link.href === '#faq' && active === 'faq');

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''} ${menuOpen ? 'is-menu' : ''}`}>
      <div className="shell site-nav__bar">
        <a href="#top" className="site-nav__logo" aria-label="PrimalOne home">
          {/* Both variants are rendered; CSS shows the light one on dark backgrounds */}
          <img className="logo-on-light" src="/img/logo-wordmark.png" alt="" width="520" height="116" />
          <img className="logo-on-dark" src="/img/logo-wordmark-light.png" alt="" width="520" height="116" />
        </a>

        <nav className="site-nav__links d-none d-lg-flex" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={isActive(link) ? 'is-active' : ''}
              aria-current={isActive(link) ? 'true' : undefined}>{link.label}</a>
          ))}
        </nav>

        <div className="site-nav__actions">
          <button type="button" className={`site-nav__cart ${bump ? 'is-bump' : ''}`} onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <Icon name="cart" size={20} />
            {count > 0 && <span className="site-nav__count" aria-hidden="true">{count}</span>}
          </button>
          <Button href="#shop" className="site-nav__cta d-none d-md-inline-flex" arrow={false}>Shop Origin</Button>
          <button ref={menuBtnRef} type="button" className="site-nav__menu-btn d-lg-none" onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className={`mobile-menu on-night ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen} inert={menuOpen ? undefined : ''}>
        <nav className="shell mobile-menu__inner" aria-label="Mobile">
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ '--i': i }}>
                <a href={link.href} onClick={(e) => closeAndGo(e, link.href)}>
                  <span className="mono" aria-hidden="true">0{i + 1}</span>{link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__foot" style={{ '--i': navLinks.length }}>
            <Button href="#shop" variant="light" onClick={(e) => closeAndGo(e, '#shop')}>Shop Origin</Button>
            <p className="mono">Sequence, don't stack.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}

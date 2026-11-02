import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { siteNav, utilityNav } from '../data/pages.js';
import { products, bundle } from '../data/content.js';
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

// Shop menu rows (after seed.com's product list): jar thumbnail, timing, name
const shopRows = [
  { id: 'origin', href: '/products/origin', tag: products.origin.shopTag, name: products.origin.name, thumb: '/img/origin-turn-poster.webp' },
  { id: 'restore', href: '/products/restore', tag: products.restore.shopTag, name: products.restore.name, thumb: '/img/restore-turn-poster.webp' },
  { id: 'duo', href: '/shop', badge: bundle.label, name: 'Origin + Restore', thumbs: ['/img/origin-turn-poster.webp', '/img/restore-turn-poster.webp'] },
];

function ShopMenu() {
  return (
    <div className="shop-menu" role="menu">
      <ul>
        {shopRows.map((r) => (
          <li key={r.id}>
            <Link to={r.href} role="menuitem" className="shop-menu__row">
              <span className={`shop-menu__thumb ${r.thumbs ? 'is-duo' : ''}`} aria-hidden="true">
                {(r.thumbs || [r.thumb]).map((src) => <img key={src} src={src} alt="" width="64" height="64" />)}
              </span>
              <span className="shop-menu__text">
                {r.badge ? <span className="shop-menu__badge">{r.badge}</span> : <span className="shop-menu__tag">{r.tag}</span>}
                <span className="shop-menu__name">{r.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/shop" role="menuitem" className="shop-menu__all">Shop all products <Icon name="arrow" size={15} /></Link>
    </div>
  );
}

// "Sign in | Cart" pill (after seed.com). Sign in opens a small email step that continues on /account.
function AccountPill({ count, bump, onCart }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    wrapRef.current?.querySelector('input')?.focus();
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    navigate('/account', { state: { email } });
  };

  return (
    <div ref={wrapRef} className={`acct ${open ? 'is-open' : ''}`}>
      <div className="acct__pill">
        <button type="button" className="acct__signin" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="acct-pop">
          <Icon name="user" size={18} className="acct__icon" />
          <span className="acct__label">Sign in</span>
        </button>
        <button type="button" className={`acct__cart ${bump ? 'is-bump' : ''}`} onClick={onCart}
          aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
          <span className="acct__label">Cart</span>
          <Icon name="cart" size={18} className="acct__icon" />
          {count > 0 && <span className="site-nav__count" aria-hidden="true">{count}</span>}
        </button>
      </div>
      <form id="acct-pop" className="acct__pop" onSubmit={submit} aria-label="Sign in">
        <p className="acct__title">Welcome back</p>
        <p className="acct__sub">Enter your email to access your account and orders.</p>
        <label className="visually-hidden" htmlFor="acct-email">Email</label>
        <input id="acct-email" type="email" required autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="acct__row">
          <Link to="/account" state={{ mode: 'signup' }} className="acct__alt">New here? Create an account</Link>
          <button type="submit" className="acct__go">Continue</button>
        </div>
      </form>
    </div>
  );
}

const mobileLinks = [
  ...siteNav.flatMap((l) => (l.children ? l.children : [l])),
  ...utilityNav,
  { label: 'Sign in / Account', href: '/account' },
];

export default function Navbar() {
  const { scrolled, hidden } = useScrollState();
  const { count, setOpen } = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
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
    setMenuOpen(false);
    setShopOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''} ${menuOpen ? 'is-menu' : ''}`}>
      <div className="shell site-nav__bar">
        <Link to="/" className="site-nav__logo" aria-label="PrimalOne home">
          <img className="logo-on-light" src="/img/logo-wordmark.png" alt="" width="520" height="116" />
          <img className="logo-on-dark" src="/img/logo-wordmark-light.png" alt="" width="520" height="116" />
        </Link>

        <nav className="site-nav__links d-none d-lg-flex" aria-label="Main">
          {siteNav.map((link) => (
            link.children ? (
              <div
                key={link.label}
                className={`site-nav__drop ${shopOpen ? 'is-open' : ''}`}
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <NavLink
                  to={link.href}
                  className={({ isActive }) => (isActive || pathname.startsWith('/products') ? 'is-active' : undefined)}
                  onFocus={() => setShopOpen(true)}
                >
                  {link.label}
                </NavLink>
                <ShopMenu />
              </div>
            ) : (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="site-nav__actions">
          <nav className="site-nav__utility d-none d-xl-flex" aria-label="Utility">
            {utilityNav.map((l) => (
              <Link key={l.href} to={l.href}>{l.label}</Link>
            ))}
          </nav>
          <AccountPill count={count} bump={bump} onCart={() => setOpen(true)} />
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
            {mobileLinks.map((link, i) => (
              <li key={link.href} style={{ '--i': i }}>
                <Link to={link.href} onClick={() => setMenuOpen(false)}>
                  <span className="mono" aria-hidden="true">0{i + 1}</span>{link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__foot" style={{ '--i': mobileLinks.length }}>
            <Button href="/products/origin" variant="light" onClick={() => setMenuOpen(false)}>Shop Origin</Button>
            <p className="mono">Sequence, don't stack.</p>
          </div>
        </nav>
      </div>
    </header>
  );
}

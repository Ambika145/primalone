import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import * as admin from '../services/admin.js';
import { Avatar, Btn, ToastProvider } from './ui.jsx';
import './Admin.css';

const NAV = [
  { group: null, items: [{ to: '/admin', label: 'Dashboard', icon: 'grid', end: true }] },
  { group: 'Sales', items: [
    { to: '/admin/orders', label: 'Orders', icon: 'box', badge: (d) => d.orders.filter(admin.toFulfil).length },
    { to: '/admin/customers', label: 'Customers', icon: 'users' },
    { to: '/admin/discounts', label: 'Discounts', icon: 'percent' },
  ] },
  { group: 'Catalogue', items: [{ to: '/admin/products', label: 'Products', icon: 'tag' }] },
  { group: 'Website', items: [
    { to: '/admin/pages', label: 'Pages', icon: 'pages' },
    { to: '/admin/journal', label: 'Journal', icon: 'doc' },
    { to: '/admin/faqs', label: 'FAQs', icon: 'help' },
    { to: '/admin/announcements', label: 'Announcement bar', icon: 'megaphone' },
  ] },
  { group: 'Inbox', items: [{ to: '/admin/messages', label: 'Messages', icon: 'inbox', badge: (d) => d.messages.filter((m) => !m.read).length }] },
  { group: null, items: [{ to: '/admin/settings', label: 'Settings', icon: 'settings' }] },
];

const TITLES = [
  ['/admin/orders', 'Orders'], ['/admin/customers', 'Customers'], ['/admin/discounts', 'Discounts'], ['/admin/products', 'Products'],
  ['/admin/pages', 'Pages'], ['/admin/journal', 'Journal'], ['/admin/faqs', 'FAQs'], ['/admin/announcements', 'Announcement bar'],
  ['/admin/messages', 'Messages'], ['/admin/settings', 'Settings'], ['/admin', 'Dashboard'],
];

export function AdminSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rakesh@primalone.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Admin sign in | PrimalOne'; }, []);
  if (admin.adminSession()) return <Navigate to="/admin" replace />;
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (!password) return setError('Please enter your password.');
    admin.adminSignIn(email);
    navigate('/admin', { replace: true });
    return undefined;
  };
  return (
    <div className="ad-login">
      <div className="ad-login__art" aria-hidden="true">
        <img src="/img/origin-jar-cutout.webp" alt="" />
        <p>Run the store,<br />the site and the sequence<br />from one place.</p>
      </div>
      <form className="ad-login__card" onSubmit={submit} noValidate>
        <img className="ad-login__logo" src="/img/logo-wordmark.png" alt="PrimalOne" />
        <h1>Admin sign in</h1>
        <p className="ad-muted">For the PrimalOne team only.</p>
        <label className="ad-field">
          <span className="ad-field__label">Email</span>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoComplete="username" />
        </label>
        <label className="ad-field">
          <span className="ad-field__label">Password</span>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} autoComplete="current-password" autoFocus />
        </label>
        {error && <p className="ad-error" role="alert">{error}</p>}
        <Btn type="submit" className="ad-btn--block">Sign in</Btn>
        {admin.DEMO_MODE && <p className="ad-note"><Icon name="info" size={15} />Demo: any password signs you in. Real admin accounts come with the backend.</p>}
        <Link to="/" className="ad-login__back"><Icon name="arrowLeft" size={15} />Back to the store</Link>
      </form>
    </div>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const counts = admin.useAdmin((d) => d);
  const who = admin.adminSession();

  useEffect(() => { setMenu(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const t = TITLES.find(([p]) => pathname.startsWith(p));
    document.title = `${t ? t[1] : 'Admin'} | PrimalOne admin`;
  }, [pathname]);

  if (!who) return <Navigate to="/admin/sign-in" replace />;
  const signOut = () => { admin.adminSignOut(); navigate('/admin/sign-in'); };

  return (
    <ToastProvider>
      <div className={`ad ${menu ? 'is-menu' : ''}`}>
        <aside className="ad-side" aria-label="Admin">
          <div className="ad-side__brand">
            <img src="/img/logo-wordmark-light.png" alt="PrimalOne" />
            <span>Admin</span>
            <button type="button" className="ad-icon-btn ad-side__close" onClick={() => setMenu(false)} aria-label="Close menu"><Icon name="close" size={18} /></button>
          </div>
          <nav className="ad-side__nav">
            {NAV.map((g, i) => (
              <div key={g.group || i} className="ad-side__group">
                {g.group && <p>{g.group}</p>}
                {g.items.map((it) => {
                  const n = it.badge ? it.badge(counts) : 0;
                  return (
                    <NavLink key={it.to} to={it.to} end={it.end}>
                      <Icon name={it.icon} size={18} />
                      <span>{it.label}</span>
                      {n > 0 && <b>{n}</b>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="ad-side__foot">
            <a href="/" target="_blank" rel="noreferrer" className="ad-side__store"><Icon name="external" size={16} />View store</a>
            <div className="ad-side__me">
              <Avatar name={who.name} size={34} />
              <div><b>{who.name}</b><span>{who.role}</span></div>
              <button type="button" className="ad-icon-btn" onClick={signOut} aria-label="Sign out" title="Sign out"><Icon name="logout" size={17} /></button>
            </div>
          </div>
        </aside>
        <button type="button" className="ad-scrim" aria-label="Close menu" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} />

        <div className="ad-main">
          <div className="ad-top">
            <button type="button" className="ad-icon-btn ad-top__menu" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" size={20} /></button>
            <img className="ad-top__logo" src="/img/logo-wordmark.png" alt="PrimalOne admin" />
            {admin.DEMO_MODE && <span className="ad-top__demo"><Icon name="info" size={14} />Demo data. Changes stay in this browser and do not change the live site.</span>}
            <span className="ad-top__date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <main className="ad-page">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

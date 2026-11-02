import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { accountPage } from '../data/pages.js';
import Icon from '../components/ui/Icon.jsx';
import { Button, Tbc } from '../components/ui/primitives.jsx';
import '../components/page/PageChrome.css';
import './AccountPage.css';

const STORAGE_KEY = 'primalone-account';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

// Account: sign in or create an account, then order history and help (after seed.com).
// There is no store backend yet, so "signing in" only remembers the email on this device;
// orders appear here once checkout is connected.
export default function AccountPage() {
  const { state } = useLocation();
  const [account, setAccount] = useState(load);
  const [mode, setMode] = useState(state?.mode === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState(state?.email || '');
  const [name, setName] = useState('');
  const [openQ, setOpenQ] = useState(null);

  useEffect(() => {
    if (state?.mode) setMode(state.mode === 'signup' ? 'signup' : 'signin');
    if (state?.email) setEmail(state.email);
  }, [state]);

  const submit = (e) => {
    e.preventDefault();
    const next = { email: email.trim(), name: name.trim() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    setAccount(next);
  };
  const signOut = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
    setAccount(null);
  };

  if (!account) {
    return (
      <div className="ip acc">
        <section className="acc-gate">
          <div className="shell acc-gate__grid">
            <div className="acc-gate__copy">
              <h1 className="ip-page-title">{accountPage.title}</h1>
              <p className="acc-gate__sub">{accountPage.sub}</p>
            </div>
            <form className="acc-card" onSubmit={submit}>
              <div className="acc-card__tabs" role="tablist" aria-label="Account">
                <button type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => setMode('signin')}>Sign in</button>
                <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => setMode('signup')}>Create account</button>
              </div>
              <p className="acc-card__title">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</p>
              <p className="acc-card__sub">
                {mode === 'signin' ? 'Enter your email to access your account.' : 'Track orders and reorder in a tap.'}
              </p>
              {mode === 'signup' && (
                <label className="acc-field">
                  <span>Full name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                </label>
              )}
              <label className="acc-field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </label>
              <button type="submit" className="acc-card__go">Continue</button>
              <p className="fine acc-card__note">Accounts connect to the store at launch <Tbc /></p>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ip acc">
      <section className="acc-dash">
        <div className="shell">
          <div className="acc-dash__head">
            <div>
              <p className="acc-dash__hi">Hi{account.name ? `, ${account.name.split(' ')[0]}` : ''}</p>
              <p className="acc-dash__email">{account.email}</p>
            </div>
            <button type="button" className="acc-dash__out" onClick={signOut}>Sign out</button>
          </div>

          <h1 className="acc-h">Order history</h1>
          <div className="acc-table" role="table" aria-label="Order history">
            <div className="acc-table__head" role="row">
              {['Date', 'Order', 'Tracking', 'Charge', 'Invoice'].map((h) => <span key={h} role="columnheader">{h}</span>)}
            </div>
            <div className="acc-table__empty" role="row">
              <span role="cell">No orders yet. Your orders and their tracking will show here.</span>
              <Button href="/shop" arrow={false}>Shop now</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="acc-help">
        <div className="shell acc-help__grid">
          <div>
            <h2 className="acc-h">Need help?</h2>
            <p className="acc-help__sub">Have more questions? Visit <Link to="/contact">Help &amp; contact</Link>.</p>
          </div>
          <ul className="acc-faq">
            {accountPage.help.map((item, i) => (
              <li key={item.q} className={openQ === i ? 'is-open' : ''}>
                <button type="button" aria-expanded={openQ === i} onClick={() => setOpenQ(openQ === i ? null : i)}>
                  {item.q} <Icon name="plus" size={18} />
                </button>
                <div className="acc-faq__a"><p>{item.a}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

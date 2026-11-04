import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { accountPage } from '../data/pages.js';
import { formatINR, products } from '../data/content.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import * as store from '../services/store.js';
import Icon from '../components/ui/Icon.jsx';
import AddressForm, { AddressLines } from '../components/account/AddressForm.jsx';
import '../components/page/PageChrome.css';
import '../components/account/AddressForm.css';
import './AccountPage.css';

const fmtDate = (iso, withTime = false) => new Date(iso).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
});
const payLabel = { upi: 'UPI', card: 'Credit / debit card', netbanking: 'Net banking' };

function DemoNote() {
  if (!store.DEMO_MODE) return null;
  return <p className="acx-demo"><Icon name="info" size={15} />Demo: accounts and orders are saved in this browser only, and no payment is taken.</p>;
}

function StatusPill({ status }) {
  return <span className={`acx-status acx-status--${status}`}>{store.STATUS_LABEL[status]}</span>;
}

/* ---------------- Sign in / create account ---------------- */

function PasswordField({ label, value, onChange, autoComplete, error, meter = false, name = 'password', autoFocus = false }) {
  const [show, setShow] = useState(false);
  const score = [value.length >= 8, /[a-z]/i.test(value) && /\d/.test(value), value.length >= 12 || /[^a-z0-9]/i.test(value)].filter(Boolean).length;
  return (
    <label className={`acx-field ${error ? 'is-bad' : ''}`}>
      <span>{label}</span>
      <span className="acx-pass">
        <input name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required aria-invalid={!!error || undefined} autoFocus={autoFocus} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </span>
      {meter && value && (
        <span className={`acx-meter acx-meter--${score}`} aria-hidden="true"><i /><i /><i /></span>
      )}
      {meter && !error && <small>{store.passwordRule}</small>}
      {error && <em role="alert">{error}</em>}
    </label>
  );
}

const perks = [
  { icon: 'box', title: 'Track every order', text: 'See where each order is, from packed to delivered.' },
  { icon: 'refresh', title: 'Reorder in a tap', text: 'Your past packs, one button away.' },
  { icon: 'pin', title: 'Saved addresses', text: 'Check out faster with your delivery details ready.' },
  { icon: 'cart', title: 'Your cart, anywhere', text: 'Items you add stay in your account.' },
];

export function AccountGate() {
  const { user, ready, login, register } = useAuth();
  const { state } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(state?.mode === 'signup' || params.get('mode') === 'signup' ? 'signup' : 'signin');
  const [form, setForm] = useState({ name: '', email: state?.email || '', phone: '', password: '' });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const from = state?.from || '/account';

  useEffect(() => { if (state?.email) setForm((f) => ({ ...f, email: state.email })); }, [state]);
  if (ready && user) return <Navigate to={from} replace />;

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); if (err?.field === k) setErr(null); };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === 'signin') await login(form); else await register(form);
      navigate(from, { replace: true });
    } catch (x) {
      setErr({ field: x.field, message: x.message });
    } finally { setBusy(false); }
  };
  const swap = (m) => { setMode(m); setErr(null); };

  return (
    <div className="ip acx acx-gate">
      <div className="shell acx-gate__grid">
        <div className="acx-gate__copy">
          <h1 className="acx-gate__title">{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="acx-gate__sub">{accountPage.sub}</p>
          <ul className="acx-perks">
            {perks.map((p, i) => (
              <li key={p.title} style={{ '--i': i }}>
                <span className="acx-perks__icon"><Icon name={p.icon} size={20} /></span>
                <span><b>{p.title}</b><small>{p.text}</small></span>
              </li>
            ))}
          </ul>
        </div>

        <form className="acx-card" onSubmit={submit} noValidate>
          <div className="acx-tabs" role="group" aria-label="Sign in or create an account">
            <span className="acx-tabs__thumb" style={{ '--at': mode === 'signin' ? 0 : 1 }} aria-hidden="true" />
            <button type="button" aria-pressed={mode === 'signin'} onClick={() => swap('signin')}>Sign in</button>
            <button type="button" aria-pressed={mode === 'signup'} onClick={() => swap('signup')}>Create account</button>
          </div>

          {mode === 'signup' && (
            <label className={`acx-field ${err?.field === 'name' ? 'is-bad' : ''}`}>
              <span>Full name</span>
              <input name="name" value={form.name} onChange={set('name')} autoComplete="name" required />
              {err?.field === 'name' && <em role="alert">{err.message}</em>}
            </label>
          )}
          <label className={`acx-field ${err?.field === 'email' ? 'is-bad' : ''}`}>
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
            {err?.field === 'email' && <em role="alert">{err.message}</em>}
          </label>
          {mode === 'signup' && (
            <label className={`acx-field ${err?.field === 'phone' ? 'is-bad' : ''}`}>
              <span>Phone (optional)</span>
              <input name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />
              {err?.field === 'phone' && <em role="alert">{err.message}</em>}
            </label>
          )}
          <PasswordField label="Password" value={form.password} onChange={set('password')}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} meter={mode === 'signup'} autoFocus={!!state?.email}
            error={err?.field === 'password' ? err.message : null} />
          {err && !err.field && <p className="acx-error" role="alert">{err.message}</p>}

          {mode === 'signin' && <Link to="/account/reset" state={{ email: form.email }} className="acx-link acx-forgot">Forgot password?</Link>}

          <button type="submit" className="acx-go" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            {!busy && <Icon name="arrow" size={18} />}
          </button>
          <p className="acx-switch">
            {mode === 'signin'
              ? <>New to PrimalOne? <button type="button" className="acx-link" onClick={() => swap('signup')}>Create an account</button></>
              : <>Already have an account? <button type="button" className="acx-link" onClick={() => swap('signin')}>Sign in</button></>}
          </p>
          {mode === 'signup' && <p className="acx-fine">By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy policy</Link>.</p>}
          <DemoNote />
        </form>
      </div>
    </div>
  );
}

export function AccountReset() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || '');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await store.requestPasswordReset(email);
    setBusy(false); setSent(true);
  };
  return (
    <div className="ip acx acx-gate">
      <div className="shell acx-reset">
        <form className="acx-card" onSubmit={submit}>
          <h1 className="acx-card__title">Reset your password</h1>
          {sent ? (
            <>
              <p className="acx-card__sub">If an account exists for <b>{email}</b>, a link to reset your password is on its way.</p>
              {store.DEMO_MODE && <p className="acx-demo"><Icon name="info" size={15} />Demo: reset emails start once the store is connected.</p>}
              <Link to="/account/sign-in" className="acx-go">Back to sign in <Icon name="arrow" size={18} /></Link>
            </>
          ) : (
            <>
              <p className="acx-card__sub">Enter the email you signed up with and we will send you a link to set a new password.</p>
              <label className="acx-field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </label>
              <button type="submit" className="acx-go" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
              <Link to="/account/sign-in" className="acx-link acx-back">Back to sign in</Link>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------------- Signed-in area ---------------- */

const tabs = [
  { to: '/account', label: 'Overview', icon: 'home', end: true },
  { to: '/account/orders', label: 'Orders', icon: 'box' },
  { to: '/account/addresses', label: 'Addresses', icon: 'pin' },
  { to: '/account/profile', label: 'Profile & security', icon: 'lock' },
];

export function AccountLayout() {
  const { user, ready, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (!ready) return <div className="ip acx acx-loading" aria-busy="true" />;
  if (!user) return <Navigate to="/account/sign-in" replace state={{ from: location.pathname }} />;

  const out = async () => { await logout(); navigate('/'); };
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="ip acx acx-area">
      <div className="shell acx-area__grid">
        <aside className="acx-side">
          <div className="acx-me">
            <span className="acx-me__avatar" aria-hidden="true">{initials}</span>
            <span className="acx-me__text"><b>{user.name}</b><small>{user.email}</small></span>
          </div>
          <nav className="acx-nav" aria-label="Account">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'is-on' : undefined)}>
                <Icon name={t.icon} size={18} />{t.label}
              </NavLink>
            ))}
            <button type="button" onClick={out}><Icon name="logout" size={18} />Sign out</button>
          </nav>
          <DemoNote />
        </aside>
        <main className="acx-main" id="account-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function useOrders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { store.listOrders().then(setOrders).catch(() => setOrders([])); }, []);
  return orders;
}

function OrderThumbs({ items }) {
  return (
    <span className="acx-thumbs" aria-hidden="true">
      {items.slice(0, 3).map((it) => <img key={`${it.product}-${it.days}`} src={`/img/${it.product}-turn-poster.webp`} alt="" width="48" height="48" />)}
    </span>
  );
}

function OrderRow({ o }) {
  const count = o.items.reduce((n, i) => n + i.qty, 0);
  return (
    <Link to={`/account/orders/${o.id}`} className="acx-order">
      <OrderThumbs items={o.items} />
      <span className="acx-order__main">
        <b>Order {o.number}</b>
        <small>{fmtDate(o.createdAt)} · {count} {count === 1 ? 'item' : 'items'}</small>
      </span>
      <StatusPill status={o.status} />
      <span className="acx-order__total">{formatINR(o.total)}</span>
      <Icon name="arrow" size={18} className="acx-order__go" />
    </Link>
  );
}

function EmptyOrders() {
  return (
    <div className="acx-empty">
      <span className="acx-empty__icon"><Icon name="box" size={26} /></span>
      <b>No orders yet</b>
      <p>When you place an order, it shows up here with its tracking.</p>
      <Link to="/shop" className="acx-btn">Shop Origin and Restore</Link>
    </div>
  );
}

export function AccountOverview() {
  const { user } = useAuth();
  const { count, setOpen } = useCart();
  const orders = useOrders();
  const [addresses, setAddresses] = useState([]);
  const [openQ, setOpenQ] = useState(null);
  useEffect(() => { store.listAddresses().then(setAddresses); }, []);
  const latest = orders?.[0];
  const active = orders?.filter(store.isOpenOrder).length ?? 0;
  const home = addresses.find((a) => a.isDefault);

  return (
    <>
      <h1 className="acx-h1">Hi, {user.name.split(' ')[0]}.</h1>
      <p className="acx-lead">Your orders, cart and details in one place.</p>

      <div className="acx-stats">
        <Link to="/account/orders" className="acx-stat"><Icon name="box" size={20} /><b>{orders ? orders.length : ''}</b><small>Orders placed</small></Link>
        <Link to="/account/orders" className="acx-stat"><Icon name="truck" size={20} /><b>{orders ? active : ''}</b><small>In progress</small></Link>
        <button type="button" className="acx-stat" onClick={() => setOpen(true)}><Icon name="cart" size={20} /><b>{count}</b><small>In your cart</small></button>
      </div>

      <section className="acx-panel">
        <div className="acx-panel__head"><h2>Latest order</h2>{orders?.length > 0 && <Link to="/account/orders" className="acx-link">All orders</Link>}</div>
        {orders === null ? <div className="acx-skel" /> : latest ? <OrderRow o={latest} /> : <EmptyOrders />}
      </section>

      <section className="acx-panel">
        <div className="acx-panel__head"><h2>Default address</h2><Link to="/account/addresses" className="acx-link">{home ? 'Manage' : 'Add one'}</Link></div>
        {home ? <div className="acx-addr acx-addr--flat"><AddressLines a={home} /></div> : <p className="acx-muted">Save an address to check out faster.</p>}
      </section>

      <section className="acx-panel">
        <div className="acx-panel__head"><h2>Need help?</h2><Link to="/contact" className="acx-link">Help &amp; contact</Link></div>
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
      </section>
    </>
  );
}

const filters = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'open', label: 'In progress', test: store.isOpenOrder },
  { id: 'delivered', label: 'Delivered', test: (o) => o.status === 'delivered' },
  { id: 'cancelled', label: 'Cancelled', test: (o) => o.status === 'cancelled' },
];

export function AccountOrders() {
  const orders = useOrders();
  const [f, setF] = useState('all');
  const list = orders?.filter(filters.find((x) => x.id === f).test) || [];
  return (
    <>
      <h1 className="acx-h1">Orders</h1>
      <p className="acx-lead">Track, reorder or get an invoice for any order.</p>
      {orders?.length > 0 && (
        <div className="acx-chips" role="tablist" aria-label="Filter orders">
          {filters.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={f === x.id} onClick={() => setF(x.id)}>
              {x.label} <span>{orders.filter(x.test).length}</span>
            </button>
          ))}
        </div>
      )}
      {orders === null ? <div className="acx-skel" />
        : orders.length === 0 ? <EmptyOrders />
          : list.length === 0 ? <p className="acx-muted acx-none">No orders here.</p>
            : <div className="acx-orders">{list.map((o) => <OrderRow key={o.id} o={o} />)}</div>}
    </>
  );
}

export function AccountOrder() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { add } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cancelError, setCancelError] = useState('');
  useEffect(() => { store.getOrder(id).then(setOrder).catch((x) => setError(x.message)); }, [id]);

  if (error) return <div className="acx-empty"><b>{error}</b><Link to="/account/orders" className="acx-btn">Back to orders</Link></div>;
  if (!order) return <div className="acx-skel acx-skel--tall" />;

  const reached = (key) => order.history.some((h) => h.key === key);
  const at = (key) => order.history.find((h) => h.key === key)?.at;
  const cancelled = order.status === 'cancelled';
  const reorder = () => order.items.forEach((it) => { for (let n = 0; n < it.qty; n += 1) add(it.product, it.days); });
  const cancel = async () => {
    setBusy(true);
    setCancelError('');
    try { setOrder(await store.cancelOrder(order.id)); setConfirm(false); } catch (x) { setCancelError(x.message); }
    setBusy(false);
  };

  return (
    <div className="acx-detail">
      <Link to="/account/orders" className="acx-backlink"><Icon name="arrowLeft" size={16} />All orders</Link>
      {params.get('placed') && (
        <div className="acx-placed" role="status">
          <span className="acx-placed__tick"><Icon name="check" size={22} /></span>
          <span><b>Thank you. Your order is placed.</b><small>{store.DEMO_MODE ? 'You can follow it here, from packed to delivered.' : `A confirmation is on its way to ${order.email}.`}</small></span>
        </div>
      )}

      <div className="acx-detail__head">
        <div>
          <h1 className="acx-h1">Order {order.number}</h1>
          <p className="acx-lead">Placed {fmtDate(order.createdAt, true)}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Tracking */}
      <section className="acx-panel">
        <h2 className="acx-panel__title">Tracking</h2>
        {cancelled ? (
          <p className="acx-muted">This order was cancelled on {fmtDate(at('cancelled'), true)}. Nothing will be charged or shipped.</p>
        ) : (
          <ol className="acx-track">
            {store.ORDER_STEPS.map((s) => (
              <li key={s.key} className={reached(s.key) ? 'is-done' : ''}>
                <span className="acx-track__dot">{reached(s.key) && <Icon name="check" size={14} />}</span>
                <b>{s.label}</b>
                <small>{reached(s.key) ? fmtDate(at(s.key), true) : 'Pending'}</small>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="acx-detail__grid">
        <section className="acx-panel">
          <h2 className="acx-panel__title">Items</h2>
          <ul className="acx-items">
            {order.items.map((it) => (
              <li key={`${it.product}-${it.days}`}>
                <img src={`/img/${it.product}-turn-poster.webp`} alt="" width="64" height="64" />
                <span><Link to={`/products/${it.product}`}>{products[it.product]?.name || it.name}</Link><small>{it.days}-day pack · Qty {it.qty}</small></span>
                <b>{formatINR(it.total)}</b>
              </li>
            ))}
          </ul>
          <dl className="acx-sums">
            <div><dt>Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
            {order.bundleOff > 0 && <div><dt>Bundle saving</dt><dd>−{formatINR(order.bundleOff)}</dd></div>}
            {order.promoOff > 0 && <div><dt>Code {order.promo?.code}</dt><dd>−{formatINR(order.promoOff)}</dd></div>}
            <div><dt>Shipping</dt><dd>{order.shipping == null ? 'Confirmed before payment' : order.shipping ? formatINR(order.shipping) : 'Free'}</dd></div>
            <div className="acx-sums__total"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
          </dl>
        </section>

        <div className="acx-detail__side">
          <section className="acx-panel">
            <h2 className="acx-panel__title">Delivery address</h2>
            <AddressLines a={order.address} />
          </section>
          <section className="acx-panel">
            <h2 className="acx-panel__title">Payment</h2>
            <p>{payLabel[order.payment.method] || order.payment.method}</p>
            <p className="acx-muted">{order.payment.status === 'paid' ? 'Paid' : cancelled ? 'Not charged' : 'Payment pending'}</p>
          </section>
          <div className="acx-actions">
            <button type="button" className="acx-btn" onClick={reorder}><Icon name="refresh" size={17} />Buy again</button>
            <button type="button" className="acx-btn acx-btn--ghost" onClick={() => window.print()}><Icon name="print" size={17} />Invoice</button>
            {order.status === 'placed' && !confirm && (
              <button type="button" className="acx-btn acx-btn--ghost acx-btn--danger" onClick={() => setConfirm(true)}>Cancel order</button>
            )}
            <Link to="/contact" className="acx-link">Help with this order</Link>
          </div>
          {confirm && (
            <div className="acx-confirm" role="alertdialog" aria-label="Cancel this order?">
              <b>Cancel order {order.number}?</b>
              <p>This cannot be undone.</p>
              {cancelError && <p className="acx-error" role="alert">{cancelError}</p>}
              <div>
                <button type="button" className="acx-btn acx-btn--danger" onClick={cancel} disabled={busy}>{busy ? 'Cancelling…' : 'Yes, cancel it'}</button>
                <button type="button" className="acx-btn acx-btn--ghost" onClick={() => setConfirm(false)}>Keep order</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountAddresses() {
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(null);   // null, 'new' or an address
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(null);
  useEffect(() => { store.listAddresses().then(setList); }, []);

  const save = async (a) => {
    setBusy(true);
    try { setList(await store.saveAddress(a)); setEditing(null); } finally { setBusy(false); }
  };
  const remove = async (id) => { setList(await store.deleteAddress(id)); setRemoving(null); };
  const makeDefault = async (id) => setList(await store.setDefaultAddress(id));

  return (
    <>
      <div className="acx-headrow">
        <div>
          <h1 className="acx-h1">Addresses</h1>
          <p className="acx-lead">Where we deliver. Your default is picked first at checkout.</p>
        </div>
        {!editing && <button type="button" className="acx-btn" onClick={() => setEditing('new')}><Icon name="plus" size={17} />Add address</button>}
      </div>

      {editing && (
        <section className="acx-panel">
          <h2 className="acx-panel__title">{editing === 'new' ? 'New address' : 'Edit address'}</h2>
          <AddressForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? {} : editing} onSubmit={save} onCancel={() => setEditing(null)} busy={busy} />
        </section>
      )}

      {list === null ? <div className="acx-skel" />
        : list.length === 0 && !editing ? (
          <div className="acx-empty">
            <span className="acx-empty__icon"><Icon name="pin" size={26} /></span>
            <b>No saved addresses</b>
            <p>Add one now and checkout fills it in for you.</p>
            <button type="button" className="acx-btn" onClick={() => setEditing('new')}>Add address</button>
          </div>
        ) : (
          <div className="acx-addrs">
            {list.map((a) => (
              <div key={a.id} className={`acx-addr ${a.isDefault ? 'is-default' : ''}`}>
                {a.isDefault && <span className="acx-addr__badge">Default</span>}
                <AddressLines a={a} />
                {removing === a.id ? (
                  <div className="acx-addr__actions acx-addr__confirm">
                    <span>Remove this address?</span>
                    <button type="button" className="acx-link acx-link--danger" onClick={() => remove(a.id)}>Remove</button>
                    <button type="button" className="acx-link" onClick={() => setRemoving(null)}>Keep</button>
                  </div>
                ) : (
                  <div className="acx-addr__actions">
                    <button type="button" className="acx-link" onClick={() => { setEditing(a); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                    {!a.isDefault && <button type="button" className="acx-link" onClick={() => makeDefault(a.id)}>Set as default</button>}
                    <button type="button" className="acx-link acx-link--danger" onClick={() => setRemoving(a.id)}>Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </>
  );
}

export function AccountProfile() {
  const { user, updateProfile } = useAuth();
  const [p, setP] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [pErr, setPErr] = useState(null);
  const [pMsg, setPMsg] = useState('');
  const [pw, setPw] = useState({ current: '', next: '' });
  const [wErr, setWErr] = useState(null);
  const [wMsg, setWMsg] = useState('');
  const [busy, setBusy] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault(); setBusy('p'); setPErr(null); setPMsg('');
    try { await updateProfile(p); setPMsg('Saved.'); } catch (x) { setPErr({ field: x.field, message: x.message }); }
    setBusy('');
  };
  const savePw = async (e) => {
    e.preventDefault(); setBusy('w'); setWErr(null); setWMsg('');
    try { await store.changePassword(pw); setPw({ current: '', next: '' }); setWMsg('Password updated.'); } catch (x) { setWErr({ field: x.field, message: x.message }); }
    setBusy('');
  };
  const set = (k) => (e) => { setP((v) => ({ ...v, [k]: e.target.value })); setPMsg(''); };

  return (
    <>
      <h1 className="acx-h1">Profile &amp; security</h1>
      <p className="acx-lead">Member since {fmtDate(user.createdAt)}.</p>

      <section className="acx-panel">
        <h2 className="acx-panel__title">Your details</h2>
        <form className="acx-form" onSubmit={saveProfile} noValidate>
          {[['name', 'Full name', 'name', 'text'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone', 'tel', 'tel']].map(([k, label, ac, type]) => (
            <label key={k} className={`acx-field acx-field--light ${pErr?.field === k ? 'is-bad' : ''}`}>
              <span>{label}</span>
              <input name={k} type={type} value={p[k]} onChange={set(k)} autoComplete={ac} />
              {pErr?.field === k && <em role="alert">{pErr.message}</em>}
            </label>
          ))}
          <div className="acx-form__foot">
            {pMsg && <span className="acx-ok" role="status"><Icon name="check" size={16} />{pMsg}</span>}
            <button type="submit" className="acx-btn" disabled={busy === 'p'}>{busy === 'p' ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </section>

      <section className="acx-panel">
        <h2 className="acx-panel__title">Change password</h2>
        <form className="acx-form acx-form--light" onSubmit={savePw} noValidate>
          <PasswordField name="current" label="Current password" value={pw.current} onChange={(e) => setPw((v) => ({ ...v, current: e.target.value }))}
            autoComplete="current-password" error={wErr?.field === 'current' ? wErr.message : null} />
          <PasswordField name="next" label="New password" value={pw.next} onChange={(e) => setPw((v) => ({ ...v, next: e.target.value }))}
            autoComplete="new-password" meter error={wErr?.field === 'next' ? wErr.message : null} />
          <div className="acx-form__foot">
            {wMsg && <span className="acx-ok" role="status"><Icon name="check" size={16} />{wMsg}</span>}
            <button type="submit" className="acx-btn" disabled={busy === 'w'}>{busy === 'w' ? 'Updating…' : 'Update password'}</button>
          </div>
        </form>
      </section>
    </>
  );
}

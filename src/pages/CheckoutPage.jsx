import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bundle, formatINR, products } from '../data/content.js';
import { checkoutPage } from '../data/pages.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as store from '../services/store.js';
import AddressForm, { AddressLines } from '../components/account/AddressForm.jsx';
import '../components/account/AddressForm.css';
import Icon from '../components/ui/Icon.jsx';
import { Button } from '../components/ui/primitives.jsx';
import '../components/page/PageChrome.css';
import './CheckoutPage.css';

// Checkout (layout after seed.com's): account, delivery and payment method on the left, the
// order summary with a discount code and totals on the right. Orders need an account so they can
// be tracked; the cart is kept while the customer signs in. In demo mode no payment is taken.
export default function CheckoutPage() {
  const { lines, count, subtotal, bundleOff, promo, promoOff, total, applyPromo, clearPromo, clear } = useCart();
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [pay, setPay] = useState('upi');
  const [addresses, setAddresses] = useState(null);
  const [addrId, setAddrId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    store.listAddresses().then((list) => {
      setAddresses(list);
      setAddrId((list.find((a) => a.isDefault) || list[0])?.id || null);
      setAdding(list.length === 0);
    });
  }, [user]);

  // A new address is saved to the account, then chosen for this order
  const addAddress = async (a) => {
    const list = await store.saveAddress(a);
    setAddresses(list);
    setAddrId(list[list.length - 1].id);
    setAdding(false);
  };

  const place = async () => {
    const address = addresses?.find((a) => a.id === addrId);
    if (!address) { setError('Please add a delivery address.'); return; }
    setPlacing(true); setError('');
    try {
      const order = await store.placeOrder({ lines, promoCode: promo?.code, address, payment: pay });
      clear();
      navigate(`/account/orders/${order.id}?placed=1`, { replace: true });
    } catch (x) {
      setError(x.message);
      setPlacing(false);
    }
  };
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');

  const submitCode = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeMsg(applyPromo(code) ? '' : 'That code is not valid.');
  };

  if (!lines.length) {
    return (
      <div className="ip co">
        <section className="co-empty shell">
          <h1 className="ip-page-title">Checkout</h1>
          <p>Your cart is empty.</p>
          <Button href="/shop">Shop Origin and Restore</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="ip co">
      <div className="co-grid">
        <div className="co-main">
          <h1 className="co-h1">Checkout</h1>

          {!ready ? null : !user ? (
            <div className="co-signin">
              <span className="co-signin__icon"><Icon name="user" size={22} /></span>
              <div>
                <b>Sign in to check out</b>
                <p>Your order is saved to your account so you can track it. Your cart stays as it is.</p>
              </div>
              <div className="co-signin__actions">
                <Link to="/account/sign-in" state={{ from: '/checkout' }} className="co-btn">Sign in</Link>
                <Link to="/account/sign-in" state={{ from: '/checkout', mode: 'signup' }} className="co-btn co-btn--ghost">Create account</Link>
              </div>
            </div>
          ) : (
            <div className="co-steps">
              <fieldset className="co-block">
                <legend>Account</legend>
                <p className="co-who"><Icon name="user" size={17} /><span><b>{user.name}</b> · {user.email}</span>
                  <button type="button" onClick={logout}>Not you?</button></p>
              </fieldset>

              <fieldset className="co-block">
                <legend>Delivery</legend>
                {addresses === null ? <p className="co-muted">Loading your addresses…</p> : (
                  <>
                    {addresses.length > 0 && (
                      <div className="co-addrs" role="radiogroup" aria-label="Delivery address">
                        {addresses.map((a) => (
                          <label key={a.id} className={`co-addr ${addrId === a.id && !adding ? 'is-on' : ''}`}>
                            <input type="radio" name="addr" checked={addrId === a.id && !adding} onChange={() => { setAddrId(a.id); setAdding(false); }} />
                            <AddressLines a={a} />
                          </label>
                        ))}
                      </div>
                    )}
                    {adding ? (
                      <div className="co-newaddr">
                        <AddressForm onSubmit={addAddress} onCancel={addresses.length ? () => setAdding(false) : undefined}
                          submitLabel="Deliver here" showDefault={addresses.length > 0} />
                      </div>
                    ) : (
                      <button type="button" className="co-add" onClick={() => setAdding(true)}><Icon name="plus" size={16} />Add a new address</button>
                    )}
                  </>
                )}
              </fieldset>

              <fieldset className="co-block">
                <legend>Payment</legend>
                <div className="co-pay">
                  {checkoutPage.payments.map((m) => (
                    <label key={m.id} className={`co-pay__opt ${pay === m.id ? 'is-on' : ''}`}>
                      <input type="radio" name="pay" value={m.id} checked={pay === m.id} onChange={() => setPay(m.id)} />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
                <p className="fine co-note">{store.DEMO_MODE ? 'Choose how you will pay. We do not offer cash on delivery.' : 'You complete payment securely on the next step. We do not offer cash on delivery.'}</p>
              </fieldset>

              {error && <p className="co-error" role="alert">{error}</p>}
              {adding && <p className="fine co-note">Save your delivery address above to place the order.</p>}
              <Button onClick={place} className="pill--block co-paynow" arrow={false} disabled={placing || adding || !addrId}>
                {placing ? 'Placing your order…' : `Place order · ${formatINR(total)}`}
              </Button>
              {store.DEMO_MODE && <p className="fine co-note">Demo: the order is saved to your account without taking payment. The payment gateway connects at launch.</p>}
            </div>
          )}
          <p className="co-links"><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></p>
        </div>

        <aside className="co-side" aria-label="Order summary">
          <ul className="co-lines">
            {lines.map((l) => (
              <li key={`${l.product}-${l.days}`}>
                <span className="co-thumb"><img src={`/img/${l.product}-turn-poster.webp`} alt="" width="64" height="64" /><b>{l.qty}</b></span>
                <span className="co-lines__name">{products[l.product].name}<small>{l.days}-day pack</small></span>
                <span>{formatINR(l.total)}</span>
              </li>
            ))}
          </ul>

          {promo ? (
            <p className="co-code co-code--on"><Icon name="tag" size={16} /> <b>{promo.code}</b> · {promo.pct}% off <button type="button" onClick={clearPromo}>Remove</button></p>
          ) : (
            <form className="co-code" onSubmit={submitCode}>
              <input value={code} onChange={(e) => { setCode(e.target.value); setCodeMsg(''); }} placeholder="Discount code" aria-label="Discount code" />
              <button type="submit">Apply</button>
            </form>
          )}
          {codeMsg && <p className="co-code__msg" role="status">{codeMsg}</p>}

          <dl className="co-sums">
            <div><dt>Subtotal · {count} {count === 1 ? 'item' : 'items'}</dt><dd>{formatINR(subtotal)}</dd></div>
            {bundleOff > 0 && <div><dt>{bundle.label}</dt><dd>−{formatINR(bundleOff)}</dd></div>}
            {promoOff > 0 && <div><dt>Code {promo.code}</dt><dd>−{formatINR(promoOff)}</dd></div>}
            <div><dt>Shipping</dt><dd className="co-muted">Confirmed before payment</dd></div>
            <div className="co-sums__total"><dt>Total</dt><dd><small>INR</small> {formatINR(total)}</dd></div>
          </dl>

          <ul className="co-assure">
            {checkoutPage.assurances.map((a) => <li key={a}><Icon name="check" size={16} />{a}</li>)}
          </ul>
        </aside>
      </div>
    </div>
  );
}

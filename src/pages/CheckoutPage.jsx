import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bundle, formatINR, products } from '../data/content.js';
import { checkoutPage } from '../data/pages.js';
import { useCart } from '../context/CartContext.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Button, Tbc } from '../components/ui/primitives.jsx';
import '../components/page/PageChrome.css';
import './CheckoutPage.css';

// Checkout (layout after seed.com's): contact, delivery and payment method on the left, the
// order summary with a discount code and totals on the right. Payment is taken by the store's
// payment gateway once it is connected, so "Pay now" stays disabled until then.
export default function CheckoutPage() {
  const { lines, count, subtotal, bundleOff, promo, promoOff, total, applyPromo, clearPromo } = useCart();
  const [pay, setPay] = useState('upi');
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
        <form className="co-main" onSubmit={(e) => e.preventDefault()}>
          <h1 className="co-h1">Checkout</h1>

          <fieldset className="co-block">
            <legend>Contact</legend>
            <input type="email" placeholder="Email" autoComplete="email" required aria-label="Email" />
          </fieldset>

          <fieldset className="co-block">
            <legend>Delivery</legend>
            <div className="co-row">
              <input placeholder="First name" autoComplete="given-name" required aria-label="First name" />
              <input placeholder="Last name" autoComplete="family-name" required aria-label="Last name" />
            </div>
            <input placeholder="Address" autoComplete="address-line1" required aria-label="Address" />
            <input placeholder="Apartment, suite, etc. (optional)" autoComplete="address-line2" aria-label="Apartment, suite, etc." />
            <div className="co-row co-row--3">
              <input placeholder="City" autoComplete="address-level2" required aria-label="City" />
              <input placeholder="State" autoComplete="address-level1" required aria-label="State" />
              <input placeholder="PIN code" inputMode="numeric" autoComplete="postal-code" required aria-label="PIN code" />
            </div>
            <input type="tel" placeholder="Phone" autoComplete="tel" required aria-label="Phone" />
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
            <p className="fine co-note">You complete payment securely on the next step. We do not offer cash on delivery.</p>
          </fieldset>

          <Button type="submit" className="pill--block co-paynow" arrow={false} disabled>Pay now · {formatINR(total)}</Button>
          <p className="fine co-note">Payment connects to the store at launch <Tbc /></p>
          <p className="co-links"><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></p>
        </form>

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

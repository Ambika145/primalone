import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bundle, products, formatINR } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import Icon from './ui/Icon.jsx';
import { Button, Tbc } from './ui/primitives.jsx';
import './CartDrawer.css';

const thumb = (id) => `/img/${id}-turn-poster.webp`;
const timing = { origin: 'Morning', restore: 'Evening, optional' };

// Cart (after seed.com's): save banner, lines with a quantity stepper, a "Bundle + save" row
// suggesting the other product, a promo code, then discounts and total above Checkout.
export default function CartDrawer() {
  const {
    open, setOpen, lines, count, subtotal, total, bundled, bundleOff, promo, promoOff,
    setQty, add, applyPromo, clearPromo, goToProduct,
  } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const returnFocus = useRef(null);
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    document.body.classList.add('is-locked');
    panelRef.current?.querySelector('.cart__close')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        // Keep keyboard focus inside the drawer while it is open.
        const f = panelRef.current.querySelectorAll('button:not([disabled]), a[href], input');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      returnFocus.current?.focus?.();
    };
  }, [open, setOpen]);

  const browse = (product) => { setOpen(false); setTimeout(() => goToProduct(product), 300); };
  const checkout = () => { setOpen(false); navigate('/checkout'); };
  const submitCode = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeMsg(applyPromo(code) ? '' : 'That code is not valid.');
  };

  // Suggest whichever product isn't in the cart yet, at its 30-day pack
  const missing = ['origin', 'restore'].filter((id) => !lines.some((l) => l.product === id));
  const suggestions = lines.length ? missing : [];
  const afterBundle = (n) => Math.round(n * (1 - bundle.pct / 100));

  return (
    <div className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="cart__scrim" onClick={() => setOpen(false)} />
      <aside ref={panelRef} className="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart__head">
          <h2 id="cart-title" className="cart__heading">Your cart <span className="cart__count">{count}</span></h2>
          <button type="button" className="cart__close" onClick={() => setOpen(false)} aria-label="Close cart">
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="cart__body">
          {lines.length > 0 && (
            <p className={`cart__banner ${bundled ? 'is-on' : ''}`}>
              <Icon name={bundled ? 'check' : 'tag'} size={17} />
              <span>{bundled ? `${bundle.label} applied` : `Save ${bundle.pct}% when you add ${missing.map((id) => products[id].name).join(' or ')}`}</span>
              {bundle.tbc && <Tbc />}
            </p>
          )}

          {lines.length === 0 ? (
            <div className="cart__empty">
              <p className="lead-text">Your cart is empty.</p>
              <Button onClick={() => browse('origin')}>Shop Origin</Button>
            </div>
          ) : (
            <ul className="cart__lines">
              {lines.map((l) => {
                const p = products[l.product];
                return (
                  <li key={`${l.product}-${l.days}`} className="cart__line">
                    <div className="cart__thumb"><img src={thumb(l.product)} alt="" width="88" height="88" /></div>
                    <div className="cart__info">
                      <p className="cart__name">{p.name}</p>
                      <p className="cart__sub">{l.days}-day pack · {timing[l.product]}</p>
                      {bundled && <span className="cart__save">{formatINR(l.total - afterBundle(l.total))} off with the bundle</span>}
                      <p className="cart__price">
                        {bundled
                          ? <><span>{formatINR(afterBundle(l.total))}</span> <s>{formatINR(l.total)}</s></>
                          : <span>{formatINR(l.total)}</span>}
                      </p>
                      <button type="button" className="cart__remove" onClick={() => setQty(l.product, l.days, 0)}>Remove</button>
                    </div>
                    <div className="cart__qty" role="group" aria-label={`${p.name} quantity`}>
                      <button type="button" onClick={() => setQty(l.product, l.days, l.qty - 1)}
                        aria-label={l.qty === 1 ? `Remove ${p.name}` : `Decrease ${p.name} quantity`}><Icon name="minus" size={14} /></button>
                      <span aria-live="polite">{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.product, l.days, l.qty + 1)} disabled={l.qty >= 9}
                        aria-label={`Increase ${p.name} quantity`}><Icon name="plus" size={14} /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {suggestions.length > 0 && (
            <section className="cart__bundle" aria-label={bundle.label}>
              <h3 className="cart__subhead">{bundle.label}</h3>
              <ul className="cart__suggest">
                {suggestions.map((id) => {
                  const p = products[id];
                  const size = p.sizes.find((s) => s.days === 30);
                  return (
                    <li key={id} className="cart__upsell">
                      <img src={thumb(id)} alt="" width="64" height="64" />
                      <div>
                        <p className="cart__upsell-name">{p.name} <small>{size.days} days · {timing[id]}</small></p>
                        <p className="cart__upsell-price"><span>{formatINR(afterBundle(size.price))}</span> <s>{formatINR(size.price)}</s></p>
                      </div>
                      <button type="button" className="cart__add" onClick={() => add(id, size.days)}>Add</button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {lines.length > 0 && (
            <form className="cart__promo" onSubmit={submitCode}>
              <label htmlFor="promo-code" className="cart__subhead">Promo code</label>
              {promo ? (
                <p className="cart__promo-on">
                  <Icon name="tag" size={16} /> <b>{promo.code}</b> · {promo.pct}% off
                  <button type="button" onClick={clearPromo}>Remove</button>
                </p>
              ) : (
                <div className="cart__promo-row">
                  <input id="promo-code" value={code} onChange={(e) => { setCode(e.target.value); setCodeMsg(''); }}
                    placeholder="Enter code" autoComplete="off" aria-describedby="promo-msg" />
                  <button type="submit">Apply</button>
                </div>
              )}
              <p id="promo-msg" className="cart__promo-msg" role="status">{codeMsg}</p>
            </form>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="cart__foot">
            <div className="cart__sum"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            {(bundleOff > 0 || promoOff > 0) && (
              <div className="cart__sum cart__sum--off"><span>Discounts</span><mark>−{formatINR(bundleOff + promoOff)}</mark></div>
            )}
            <div className="cart__total"><span>Total</span><strong>{formatINR(total)}</strong></div>
            <p className="fine">Shipping calculated at checkout · One-time purchase, no commitment.</p>
            <Button className="pill--block cart__checkout" arrow={false} onClick={checkout}>Checkout</Button>
          </footer>
        )}
      </aside>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { products, formatINR } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import Icon from './ui/Icon.jsx';
import { Button, Img, Tbc } from './ui/primitives.jsx';
import './CartDrawer.css';

export default function CartDrawer() {
  const { open, setOpen, lines, count, subtotal, setQty, goToProduct } = useCart();
  const panelRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    document.body.classList.add('is-locked');
    panelRef.current?.querySelector('.cart__close')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        // Keep keyboard focus inside the drawer while it is open.
        const f = panelRef.current.querySelectorAll('button:not([disabled]), a[href]');
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

  return (
    <div className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="cart__scrim" onClick={() => setOpen(false)} />
      <aside ref={panelRef} className="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart__head">
          <h2 id="cart-title" className="h-md">Your cart <span className="cart__count">{count}</span></h2>
          <button type="button" className="cart__close" onClick={() => setOpen(false)} aria-label="Close cart">
            <Icon name="close" size={22} />
          </button>
        </header>

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
                  <div className="cart__thumb frame"><Img name={p.shopImage.name} alt="" sizes="96px" /></div>
                  <div className="cart__info">
                    <p className="cart__name">{p.name}</p>
                    <p className="mono">{l.days}-day pack · {l.product === 'origin' ? 'Morning' : 'Evening, optional'}</p>
                    <div className="cart__qty" role="group" aria-label={`${p.name} quantity`}>
                      <button type="button" onClick={() => setQty(l.product, l.days, l.qty - 1)}
                        aria-label={l.qty === 1 ? `Remove ${p.name}` : `Decrease ${p.name} quantity`}><Icon name="minus" size={14} /></button>
                      <span aria-live="polite">{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.product, l.days, l.qty + 1)} disabled={l.qty >= 9}
                        aria-label={`Increase ${p.name} quantity`}><Icon name="plus" size={14} /></button>
                    </div>
                  </div>
                  <div className="cart__price">
                    <span>{formatINR(l.total)}</span>
                    <button type="button" className="cart__remove" onClick={() => setQty(l.product, l.days, 0)}>Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && !lines.some((l) => l.product === 'restore') && (
          <button type="button" className="cart__upsell" onClick={() => browse('restore')}>
            <Icon name="moon" size={18} />
            <span>Add Restore if you want the night. <em>Optional.</em></span>
            <Icon name="arrow" size={16} />
          </button>
        )}

        <footer className="cart__foot">
          <div className="cart__total"><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div>
          <p className="fine">One-time purchase, no commitment.</p>
          {/* No checkout exists in this project yet; the button stays disabled until the store is connected. */}
          <Button className="pill--block" disabled>Checkout</Button>
          <p className="fine cart__note">Checkout connects to the store at launch <Tbc /></p>
        </footer>
      </aside>
    </div>
  );
}

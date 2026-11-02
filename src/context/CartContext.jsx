import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bundle, products, promoCodes } from '../data/content.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'primalone-cart';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((l) => products[l.product] && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const [lines, setLines] = useState(loadCart);
  const [open, setOpen] = useState(false);
  // Pack size chosen in the Shop section, shared so other CTAs can preselect a product.
  const [selected, setSelected] = useState({ origin: 30, restore: 30 });
  const [highlight, setHighlight] = useState(null);
  const [promo, setPromo] = useState(null);   // { code, pct } once a valid code is applied

  // Returns true when the code is accepted. Codes come from promoCodes in content.js.
  const applyPromo = useCallback((raw) => {
    const code = raw.trim().toUpperCase();
    const pct = promoCodes[code];
    if (!pct) return false;
    setPromo({ code, pct });
    return true;
  }, []);
  const clearPromo = useCallback(() => setPromo(null), []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ }
  }, [lines]);

  const add = useCallback((product, days) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product === product && l.days === days);
      if (i === -1) return [...prev, { product, days, qty: 1 }];
      return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(9, l.qty + 1) } : l));
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((product, days, qty) => {
    setLines((prev) => prev
      .map((l) => (l.product === product && l.days === days ? { ...l, qty: Math.min(9, qty) } : l))
      .filter((l) => l.qty > 0));
  }, []);

  // Scroll to a product's card in the Shop section and briefly highlight it.
  const goToProduct = useCallback((product) => {
    const card = document.getElementById(`shop-${product}`);
    if (card) {
      card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      setHighlight(product);
      window.setTimeout(() => setHighlight(null), 1800);
      return;
    }
    navigate(`/products/${product}`);
  }, [navigate]);

  const value = useMemo(() => {
    const priced = lines.map((l) => {
      const size = products[l.product].sizes.find((s) => s.days === l.days);
      return { ...l, price: size.price, total: size.price * l.qty };
    });
    const subtotal = priced.reduce((n, l) => n + l.total, 0);
    // Bundle + save: Origin and Restore together in one order
    const bundled = priced.some((l) => l.product === 'origin') && priced.some((l) => l.product === 'restore');
    const bundleOff = bundled ? Math.round((subtotal * bundle.pct) / 100) : 0;
    const promoOff = promo ? Math.round(((subtotal - bundleOff) * promo.pct) / 100) : 0;
    return {
      lines: priced,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      bundled, bundleOff, promo, promoOff,
      discount: bundleOff + promoOff,
      total: subtotal - bundleOff - promoOff,
      applyPromo, clearPromo,
      open, setOpen, add, setQty,
      selected, setSelected, highlight, goToProduct,
    };
  }, [lines, open, add, setQty, selected, highlight, goToProduct, promo, applyPromo, clearPromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

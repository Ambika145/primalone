import { useEffect, useState } from 'react';
import { products, formatINR } from '../data/content.js';
import { Button } from './ui/primitives.jsx';
import './StickyBuyBar.css';

// Phones only: once the hero is gone, keep "Shop Origin" in reach until the Shop section is reached.
// Below Shop the final CTA and footer carry their own buttons, so it stays hidden there too.
export default function StickyBuyBar() {
  const [pastHero, setPastHero] = useState(false);
  const [atShop, setAtShop] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('hero'), shop = document.getElementById('shop');
    if (!hero || !shop) return;
    const a = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
    const b = new IntersectionObserver(([e]) => setAtShop(e.isIntersecting || e.boundingClientRect.top < 0), { rootMargin: '0px 0px -30% 0px' });
    a.observe(hero); b.observe(shop);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);
  const show = pastHero && !atShop;
  const from = Math.min(...products.origin.sizes.map((s) => s.perDay));

  return (
    <div className={`sticky-buy ${show ? 'is-shown' : ''}`} aria-hidden={!show} inert={show ? undefined : ''}>
      <div>
        <small>Origin · daily essentials</small>
        <b>From {formatINR(from)}/day</b>
      </div>
      <Button href="#shop" variant="light" arrow={false}>Shop Origin</Button>
    </div>
  );
}

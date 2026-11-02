import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { products, shop, formatINR } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import { useReducedMotion } from '../hooks/motion.js';
import { Button, Reveal, SplitLines, TextLink } from './ui/primitives.jsx';
import './Shop.css';

// Compact product card (after seed.com's product row): a timing pill, the name, the jar that
// turns while the card is hovered, a small pack-size switch, and one button.
function PackCard({ id }) {
  const p = products[id];
  const { selected, setSelected, add, highlight } = useCart();
  const days = selected[id];
  const size = p.sizes.find((s) => s.days === days);
  const from = Math.min(...p.sizes.map((s) => s.price));
  const videoRef = useRef(null);
  const reduced = useReducedMotion();

  const spin = (on) => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (on) v.play().catch(() => {});
    else { v.pause(); v.currentTime = 0; }
  };

  return (
    <article
      id={`shop-${id}`}
      className={`pack pack--${id} ${highlight === id ? 'is-highlight' : ''}`}
      aria-labelledby={`pack-${id}-title`}
      onPointerEnter={() => spin(true)} onPointerLeave={() => spin(false)}
      onFocus={() => spin(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && spin(false)}
    >
      {id === 'origin' && <span className="pack__badge">Start here</span>}
      <span className="pack__tag">{p.shopTag}</span>
      <h3 id={`pack-${id}-title`} className="pack__name">{p.shopTitle}</h3>
      <p className="pack__desc">{p.shopDescriptor}</p>

      <Link className="pack__jar" to={`/products/${id}`} tabIndex={-1} aria-hidden="true">
        <video ref={videoRef} src={p.image.scrub} poster={`/img/${id}-turn-poster.webp`} muted loop playsInline preload="none" />
      </Link>

      <div className="pack__sizes" role="radiogroup" aria-label={`${p.name} pack size`}>
        {p.sizes.map((s) => (
          <button key={s.days} type="button" role="radio" aria-checked={s.days === days}
            className={`size ${s.days === days ? 'is-on' : ''}`}
            onClick={() => setSelected((prev) => ({ ...prev, [id]: s.days }))}>
            {s.days} days
          </button>
        ))}
      </div>

      <Button className="pack__cta" arrow={false} onClick={() => add(id, days)}>
        Add to cart · <span key={size.price} className="pack__price">{formatINR(size.price)}</span>
      </Button>
      <p className="pack__from">
        ≈ {formatINR(size.perDay)} / day · <Link to={`/products/${id}`} className="pack__more">Details<span className="visually-hidden"> about {p.name}</span></Link>
      </p>
      <span className="visually-hidden">Packs from {formatINR(from)}</span>
    </article>
  );
}

export default function Shop() {
  return (
    <section id="shop" className="section shop on-dark" aria-labelledby="shop-title">
      <div className="shell shop__grid">
        <div className="shop__head">
          <SplitLines id="shop-title" className="h-xl shop__title" lines={[shop.title]} />
          <Reveal as="p" delay={100} className="shop__lead">{shop.lead}</Reveal>
          <Reveal delay={160}><TextLink href="/shop" className="shop__all">Shop all</TextLink></Reveal>
        </div>
        <Reveal className="shop__col"><PackCard id="origin" /></Reveal>
        <Reveal className="shop__col" delay={140}><PackCard id="restore" /></Reveal>
      </div>
    </section>
  );
}

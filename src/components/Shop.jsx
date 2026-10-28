import { products, shop, formatINR } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import { Button, Img, Reveal, SafetyNote, SplitLines } from './ui/primitives.jsx';
import './Shop.css';

function PackCard({ id, featured }) {
  const p = products[id];
  const { selected, setSelected, add, highlight } = useCart();
  const days = selected[id];
  const size = p.sizes.find((s) => s.days === days);
  const dark = featured;

  return (
    <article
      id={`shop-${id}`}
      className={`pack pack--${id} ${dark ? 'on-dark' : ''} ${highlight === id ? 'is-highlight' : ''}`}
      aria-labelledby={`pack-${id}-title`}
    >
      <div className="pack__media frame">
        <Img
          className="pack__photo"
          name={p.shopImage.name}
          alt={p.shopImage.alt}
          sizes="(min-width: 992px) 40vw, 90vw"
        />
      </div>

      <div className="pack__body">
        <div className="pack__intro">
          <h3 id={`pack-${id}-title`} className="pack__name">
            {p.shopTitle}
            <span>{p.shopDescriptor}</span>
          </h3>
          <p className="pack__copy">{p.shopCopy}</p>
        </div>

        <fieldset className="pack__sizes">
          <legend className="visually-hidden">{p.name} pack size</legend>
          {p.sizes.map((s) => (
            <label key={s.days} className={`size ${s.days === days ? 'is-on' : ''}`}>
              <input
                type="radio"
                name={`${id}-size`}
                value={s.days}
                checked={s.days === days}
                onChange={() => setSelected((prev) => ({ ...prev, [id]: s.days }))}
              />
              <span className="mono">{s.days} days</span>
              <b>{formatINR(s.price)}</b>
              <small>≈ {formatINR(s.perDay)} / day</small>
            </label>
          ))}
        </fieldset>

        <SafetyNote tone={dark ? 'dark' : 'light'} className="pack__safety" />

        <Button variant={dark ? 'light' : 'dark'} className="pill--block pack__cta" onClick={() => add(id, days)}>
          {p.ctaPrefix} · <span key={size.price} className="pack__price">{formatINR(size.price)}</span>
        </Button>
      </div>
    </article>
  );
}

export default function Shop() {
  return (
    <section id="shop" className="section shop" aria-labelledby="shop-title">
      <div className="shell">
        <div className="shop__head">
          <SplitLines id="shop-title" className="h-xl shop__title" lines={[shop.title]} />
          <Reveal as="p" delay={100} className="shop__lead">{shop.lead}</Reveal>
        </div>

        <div className="shop__grid">
          <Reveal className="shop__col">
            <PackCard id="origin" featured />
          </Reveal>
          <Reveal className="shop__col" delay={140}>
            <PackCard id="restore" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

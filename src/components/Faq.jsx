import { useState } from 'react';
import { faq } from '../data/content.js';
import Icon from './ui/Icon.jsx';
import { Button, Img, SafetyNote, SplitLines } from './ui/primitives.jsx';
import './Faq.css';

function FaqItem({ item, index, open, onToggle }) {
  const id = `faq-${index}`;
  return (
    <li className={`faq-item ${open ? 'is-open' : ''}`}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
        >
          <span className="faq-item__q">{item.q}</span>
          <span className="faq-item__icon" aria-hidden="true">
            <Icon name="plus" size={16} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className="faq-item__a"
        inert={open ? undefined : ''}
      >
        <div className="faq-item__panel">
          {item.safety ? <SafetyNote /> : <p>{item.a}</p>}
        </div>
      </div>
    </li>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(() => new Set([1]));
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  const allOpen = open.size === faq.items.length;

  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="shell faq__shell">
        <aside className="faq__visual" aria-hidden="true">
          <div className="faq__media frame">
            <Img
              name={faq.image.name}
              alt=""
              sizes="(min-width: 992px) 38vw, 90vw"
            />
          </div>
          <div className="faq__cta-block">
            <p className="faq__cta-copy">{faq.lead}</p>
            <Button href="#shop">Shop Origin</Button>
          </div>
        </aside>

        <div className="faq__content">
          <header className="faq__head">
            <SplitLines id="faq-title" className="h-xl faq__title" lines={[faq.title]} />
            <button
              type="button"
              className="faq__expand"
              onClick={() =>
                setOpen(allOpen ? new Set() : new Set(faq.items.map((_, i) => i)))
              }
            >
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </header>

          <ul className="faq__list">
            {faq.items.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                index={i}
                open={open.has(i)}
                onToggle={() => toggle(i)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

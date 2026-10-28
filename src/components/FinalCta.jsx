import { finalCta } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import { useInView } from '../hooks/motion.js';
import { Button, SplitLines } from './ui/primitives.jsx';
import './FinalCta.css';

export default function FinalCta() {
  const { goToProduct } = useCart();
  const [ref, inView] = useInView({ threshold: 0.35 });
  const go = (product) => (e) => { e.preventDefault(); goToProduct(product); };

  return (
    <section ref={ref} className={`final on-night ${inView ? 'is-in' : ''}`} aria-labelledby="final-title">
      <div className="shell final__inner">
        <SplitLines id="final-title" className="h-xl final__title" lines={finalCta.titleLines} accentLast />
        <p className="final__sub">{finalCta.sub}</p>
        <div className="final__actions">
          <Button href="#shop-origin" variant="light" onClick={go('origin')}>{finalCta.primary}</Button>
          <Button href="#shop-restore" variant="outline-light" onClick={go('restore')}>{finalCta.secondary}</Button>
        </div>
      </div>
    </section>
  );
}

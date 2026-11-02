import { Img } from '../ui/primitives.jsx';
import './PhotoBleed.css';

/**
 * Homepage-style photography: full-bleed crop with a soft day/night veil so type stays readable.
 * Uses the same Img pipeline as Hero / Shop / Sequence.
 */
export default function PhotoBleed({
  name,
  alt = '',
  tone = 'day',
  crop = 'center',
  priority = false,
  className = '',
  sizes = '100vw',
}) {
  return (
    <div className={`photo-bleed photo-bleed--${tone} photo-bleed--${crop} ${className}`} aria-hidden={alt ? undefined : true}>
      <div className="photo-bleed__media">
        <Img name={name} alt={alt} priority={priority} sizes={sizes} />
      </div>
      <div className="photo-bleed__veil" />
    </div>
  );
}

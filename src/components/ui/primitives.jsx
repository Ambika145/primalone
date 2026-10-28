import { useInView } from '../../hooks/motion.js';
import { SHOW_REVIEW_TAGS, safetyNote } from '../../data/content.js';
import Icon from './Icon.jsx';

// Widths produced by scripts/optimize-images.mjs for every photo.
const widths = [640, 1080, 1600];

export function Img({ name, alt, sizes = '100vw', priority = false, className = '', style }) {
  return (
    <img
      className={className}
      style={style}
      src={`/img/${name}-1080.webp`}
      srcSet={widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}

// Scroll reveal wrapper. Children animate in via CSS once the block enters the viewport.
export function Reveal({ as: Tag = 'div', className = '', delay = 0, variant = 'up', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--delay': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, icon, className = '' }) {
  return (
    <p className={`eyebrow ${className}`}>
      {icon ? <Icon name={icon} size={15} /> : <span className="eyebrow__dot" aria-hidden="true" />}
      {children}
    </p>
  );
}

// Yellow review tag for facts the client still has to confirm. Remove before launch.
export function Tbc({ children = 'To confirm' }) {
  if (!SHOW_REVIEW_TAGS) return null;
  return <span className="tbc">{children}</span>;
}

export function SafetyNote({ tone = 'light', className = '' }) {
  return (
    <p className={`safety safety--${tone} ${className}`} role="note">
      <Icon name="info" size={18} />
      <span>{safetyNote}</span>
    </p>
  );
}

export function Button({ href, onClick, variant = 'dark', children, arrow = true, className = '', ...rest }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} type={href ? undefined : 'button'}
      className={`pill pill--${variant} ${className}`} {...rest}>
      <span className="pill__label">{children}</span>
      {arrow && <span className="pill__arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>}
    </Tag>
  );
}

export function TextLink({ href, children, className = '', ...rest }) {
  return (
    <a href={href} className={`text-link ${className}`} {...rest}>
      <span>{children}</span>
      <Icon name="arrow" size={16} />
    </a>
  );
}

// Splits a heading into masked lines that rise in on reveal.
export function SplitLines({ lines, as: Tag = 'h2', className = '', accentLast = false, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <Tag ref={ref} className={`split ${inView ? 'is-in' : ''} ${className}`} {...rest}>
      {lines.map((line, i) => (
        <span className="split__line" key={i}>
          <span className={`split__inner ${accentLast && i === lines.length - 1 ? 'is-accent' : ''}`} style={{ '--i': i }}>
            {line}
          </span>
          {/* keeps words apart in the accessible name, since each line is its own block */}
          {i < lines.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

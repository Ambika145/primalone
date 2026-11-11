// Shared admin building blocks: headings, cards, badges, fields, drawer, toasts and charts.
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '../components/ui/Icon.jsx';
import { formatINR } from '../data/content.js';
import { STATUS_LABEL } from '../services/admin.js';

export const inr = formatINR;
export const dateShort = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const dateLong = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const dateTime = (iso) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
export function ago(iso) {
  const m = Math.round((Date.now() - Date.parse(iso)) / 6e4);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}
export const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export function PageHead({ title, sub, actions, back }) {
  return (
    <header className="ad-head">
      <div>
        {back}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="ad-head__actions">{actions}</div>}
    </header>
  );
}

export function Card({ title, action, children, className = '', pad = true }) {
  return (
    <section className={`ad-card ${pad ? '' : 'ad-card--flush'} ${className}`}>
      {(title || action) && (
        <div className="ad-card__head">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Btn({ variant = 'primary', icon, children, className = '', ...rest }) {
  return (
    <button type="button" className={`ad-btn ad-btn--${variant} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children && <span>{children}</span>}
    </button>
  );
}

const TONE = { placed: 'amber', packed: 'blue', shipped: 'violet', out: 'violet', delivered: 'green', cancelled: 'grey' };
export function StatusBadge({ status }) {
  return <Badge tone={TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}
export function Badge({ tone = 'grey', children }) {
  return <span className={`ad-badge ad-badge--${tone}`}><i aria-hidden="true" />{children}</span>;
}

export function Avatar({ name, size = 36 }) {
  return <span className="ad-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">{initials(name)}</span>;
}

export function Field({ label, hint, children, wide = false }) {
  return (
    <label className={`ad-field ${wide ? 'ad-field--wide' : ''}`}>
      <span className="ad-field__label">{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Toggle({ checked, onChange, label, hint }) {
  const id = useId();
  return (
    <div className="ad-toggle">
      <div>
        <label htmlFor={id}>{label}</label>
        {hint && <small>{hint}</small>}
      </div>
      <button id={id} type="button" role="switch" aria-checked={checked} className={checked ? 'is-on' : ''} onClick={() => onChange(!checked)}>
        <span />
      </button>
    </div>
  );
}

export function Search({ value, onChange, placeholder }) {
  return (
    <div className="ad-search">
      <Icon name="search" size={17} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
  );
}

export function Tabs({ value, onChange, items }) {
  return (
    <div className="ad-tabs" role="group">
      {items.map((t) => (
        <button key={t.key} type="button" aria-pressed={value === t.key} onClick={() => onChange(t.key)}>
          {t.label}{t.count != null && <b>{t.count}</b>}
        </button>
      ))}
    </div>
  );
}

export function Empty({ icon = 'search', title, children }) {
  return (
    <div className="ad-empty">
      <span><Icon name={icon} size={22} /></span>
      <b>{title}</b>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Drawer({ open, onClose, title, children, footer }) {
  const ref = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  // runs when the drawer opens, not on every keystroke, so focus stays in the field being typed in
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && close.current();
    document.addEventListener('keydown', onKey);
    if (!ref.current?.contains(document.activeElement)) ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="ad-drawer" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="ad-drawer__scrim" aria-label="Close" onClick={onClose} />
      <div className="ad-drawer__panel" ref={ref} tabIndex={-1}>
        <div className="ad-drawer__head">
          <h2>{title}</h2>
          <button type="button" className="ad-icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
        </div>
        <div className="ad-drawer__body">{children}</div>
        {footer && <div className="ad-drawer__foot">{footer}</div>}
      </div>
    </div>
  );
}

// Inline "are you sure" row, used instead of browser confirm boxes
export function Confirm({ text, yes = 'Delete', onYes, onNo }) {
  return (
    <div className="ad-confirm" role="alert">
      <span>{text}</span>
      <Btn variant="danger" onClick={onYes}>{yes}</Btn>
      <Btn variant="ghost" onClick={onNo}>Keep</Btn>
    </div>
  );
}

/* ---------------- Toasts ---------------- */

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text) => {
    const id = Math.random();
    setItems((l) => [...l, { id, text }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="ad-toasts" aria-live="polite">
        {items.map((t) => <div key={t.id} className="ad-toast"><Icon name="check" size={16} />{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

// Save bar that appears while a form has unsaved changes
export function SaveBar({ dirty, onSave, onReset }) {
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  if (!dirty) return null;
  return (
    <div className="ad-savebar" role="region" aria-label="Unsaved changes">
      <span>You have unsaved changes</span>
      <div>
        <Btn variant="ghost-dark" onClick={onReset}>Discard</Btn>
        <Btn variant="gold" onClick={onSave}>Save changes</Btn>
      </div>
    </div>
  );
}

// Form state with a dirty flag, for edit pages
export function useDraft(source) {
  const [draft, setDraft] = useState(source);
  const saved = JSON.stringify(source);
  useEffect(() => { setDraft(JSON.parse(saved)); }, [saved]);
  const dirty = JSON.stringify(draft) !== saved;
  const set = (path) => (e) => {
    const v = e?.target ? (e.target.type === 'number' ? Number(e.target.value) : e.target.value) : e;
    setDraft((d) => {
      const next = structuredClone(d);
      const keys = path.split('.');
      let o = next;
      keys.slice(0, -1).forEach((k) => { o = o[k]; });
      o[keys.at(-1)] = v;
      return next;
    });
  };
  return { draft, setDraft, set, dirty, reset: () => setDraft(JSON.parse(saved)) };
}

/* ---------------- Charts ---------------- */

// One-series area chart with a crosshair tooltip. Values are labelled in the tooltip and axis.
export function AreaChart({ data, value, format, label }) {
  // Drawn at the width it is shown at, so the axis text stays readable on phones
  const box = useRef(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const H = W < 500 ? 200 : 240; const P = { l: 48, r: 10, t: 16, b: 28 };
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map(value));
  const nice = useMemo(() => {
    const step = 10 ** Math.floor(Math.log10(max));
    return Math.ceil(max / step) * step;
  }, [max]);
  const x = (i) => P.l + (i * (W - P.l - P.r)) / Math.max(1, data.length - 1);
  const y = (v) => P.t + (H - P.t - P.b) * (1 - v / nice);
  const pts = data.map((d, i) => [x(i), y(value(d))]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const area = `${line}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;
  const ticks = [0, 0.5, 1].map((f) => nice * f);
  const every = Math.ceil(data.length / Math.max(3, Math.floor(W / 120)));
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - P.l) / (W - P.l - P.r)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };
  const h = hover != null ? data[hover] : null;
  return (
    <div className="ad-chart" ref={box}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="ad-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ad-s1)" stopOpacity=".22" />
            <stop offset="1" stopColor="var(--ad-s1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="ad-chart__grid" />
            <text x={P.l - 10} y={y(t) + 4} textAnchor="end" className="ad-chart__tick">{format(t, true)}</text>
          </g>
        ))}
        {data.map((d, i) => ((i % every === 0 && data.length - 1 - i >= every / 2) || i === data.length - 1) && (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} className="ad-chart__tick">{dateShort(d.date)}</text>
        ))}
        <path d={area} fill="url(#ad-area)" />
        <path d={line} fill="none" stroke="var(--ad-s1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {h && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={y(0)} className="ad-chart__cross" />
            <circle cx={x(hover)} cy={y(value(h))} r="5" fill="var(--ad-s1)" stroke="var(--ad-card)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {h && (
        <div className="ad-chart__tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <span>{dateLong(h.date.toISOString())}</span>
          <b>{format(value(h))}</b>
          <span>{h.orders} {h.orders === 1 ? 'order' : 'orders'}</span>
        </div>
      )}
    </div>
  );
}

// Horizontal bars with the name and value written beside each bar
export function BarList({ rows, format }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="ad-bars">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${format(r.value)}`}>
          <div className="ad-bars__row"><span>{r.label}</span><b>{format(r.value)}</b></div>
          <div className="ad-bars__track"><i style={{ width: `${(r.value / max) * 100}%`, background: r.color || 'var(--ad-s1)' }} /></div>
          {r.note && <small>{r.note}</small>}
        </li>
      ))}
    </ul>
  );
}

export function Delta({ now, before }) {
  if (!before) return <span className="ad-delta">No earlier data</span>;
  const pct = Math.round(((now - before) / before) * 100);
  const up = pct >= 0;
  return (
    <span className={`ad-delta ${up ? 'is-up' : 'is-down'}`}>
      <Icon name={up ? 'trendUp' : 'trendDown'} size={14} />{up ? '+' : ''}{pct}% vs previous
    </span>
  );
}

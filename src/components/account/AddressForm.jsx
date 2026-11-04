import { useState } from 'react';
import { indianStates } from '../../data/pages.js';
import { validateAddress } from '../../services/store.js';

export const emptyAddress = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '', isDefault: false };

// One delivery address. Used on the Addresses page and at checkout. Validates on submit and
// shows the first problem beside its field.
export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address', busy = false, showDefault = true }) {
  const [a, setA] = useState({ ...emptyAddress, ...initial });
  const [err, setErr] = useState(null);
  const set = (k) => (e) => { setA((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })); if (err?.field === k) setErr(null); };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validateAddress(a);
    if (problem) { setErr(problem); e.currentTarget.querySelector(`[name="${problem.field}"]`)?.focus(); return; }
    try { await onSubmit(a); } catch (x) { setErr({ field: x.field, message: x.message }); }
  };

  const field = (k, label, props = {}) => (
    <label className={`af-field ${props.wide ? 'af-field--wide' : ''} ${err?.field === k ? 'is-bad' : ''}`}>
      <span>{label}</span>
      <input name={k} value={a[k]} onChange={set(k)} aria-invalid={err?.field === k || undefined} {...props.input} />
      {err?.field === k && <em role="alert">{err.message}</em>}
    </label>
  );

  return (
    <form className="af" onSubmit={submit} noValidate>
      <div className="af-grid">
        {field('name', 'Full name', { input: { autoComplete: 'name' } })}
        {field('phone', 'Phone', { input: { type: 'tel', autoComplete: 'tel', inputMode: 'tel' } })}
        {field('line1', 'Flat, house, street', { wide: true, input: { autoComplete: 'address-line1' } })}
        {field('line2', 'Area, landmark (optional)', { wide: true, input: { autoComplete: 'address-line2' } })}
        {field('city', 'City', { input: { autoComplete: 'address-level2' } })}
        <label className={`af-field ${err?.field === 'state' ? 'is-bad' : ''}`}>
          <span>State</span>
          <select name="state" value={a.state} onChange={set('state')} autoComplete="address-level1" aria-invalid={err?.field === 'state' || undefined}>
            <option value="">Select</option>
            {indianStates.map((s) => <option key={s}>{s}</option>)}
          </select>
          {err?.field === 'state' && <em role="alert">{err.message}</em>}
        </label>
        {field('pin', 'PIN code', { input: { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' } })}
      </div>
      {showDefault && (
        <label className="af-check">
          <input type="checkbox" checked={a.isDefault} onChange={set('isDefault')} />
          <span>Make this my default address</span>
        </label>
      )}
      {err && !['name', 'phone', 'line1', 'line2', 'city', 'state', 'pin'].includes(err.field) && <p className="af-error" role="alert">{err.message}</p>}
      <div className="af-actions">
        {onCancel && <button type="button" className="af-btn af-btn--ghost" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="af-btn" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  );
}

// One-line summary of an address, for cards and order pages
export function AddressLines({ a }) {
  return (
    <address className="af-lines">
      <b>{a.name}</b>
      <span>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</span>
      <span>{a.city}, {a.state} {a.pin}</span>
      <span>{a.phone}</span>
    </address>
  );
}

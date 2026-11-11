import { useState } from 'react';
import * as admin from '../../services/admin.js';
import { Badge, Btn, Card, Confirm, Drawer, Empty, Field, PageHead, Toggle, dateLong, useToast } from '../ui.jsx';

const blank = { code: '', pct: 10, active: true, limit: '', ends: '' };

export default function Discounts() {
  const toast = useToast();
  const d = admin.useAdmin((x) => x);
  const [bundlePct, setBundlePct] = useState(d.bundle.pct);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const state = (p) => {
    if (!p.active) return ['grey', 'Off'];
    if (p.ends && p.ends < today) return ['grey', 'Ended'];
    if (p.limit && p.uses >= p.limit) return ['amber', 'Used up'];
    return ['green', 'Active'];
  };
  const save = () => {
    const code = edit.code.trim().toUpperCase();
    if (!/^[A-Z0-9]{3,20}$/.test(code)) return setError('Use 3 to 20 letters or numbers, no spaces.');
    if (d.promos.some((p) => p.code === code && p.id !== edit.id)) return setError('That code already exists.');
    if (!(edit.pct >= 1 && edit.pct <= 90)) return setError('The discount must be between 1% and 90%.');
    admin.savePromo({ ...edit, limit: edit.limit ? Number(edit.limit) : '' });
    toast(`Code ${code} saved`);
    setEdit(null);
    return undefined;
  };

  return (
    <>
      <PageHead title="Discounts" sub="The bundle saving and discount codes." actions={<Btn icon="plus" onClick={() => { setError(''); setEdit({ ...blank }); }}>New code</Btn>} />
      <div className="ad-grid ad-grid--1-2">
        <Card title="Bundle saving">
          <p className="ad-muted">Taken off automatically when Origin and Restore are in the same order.</p>
          <Toggle label="Bundle saving" hint={d.bundle.active ? 'On' : 'Off'} checked={d.bundle.active} onChange={(v) => { admin.saveBundle({ ...d.bundle, active: v }); toast(v ? 'Bundle saving on' : 'Bundle saving off'); }} />
          <div className="ad-inline">
            <Field label="Saving (%)"><input type="number" min="1" max="50" value={bundlePct} onChange={(e) => setBundlePct(Number(e.target.value))} /></Field>
            <Btn variant="ghost" disabled={bundlePct === d.bundle.pct || !(bundlePct >= 1 && bundlePct <= 50)} onClick={() => { admin.saveBundle({ ...d.bundle, pct: bundlePct }); toast('Bundle saving updated'); }}>Save</Btn>
          </div>
        </Card>

        <Card title="Discount codes" pad={false}>
          {d.promos.length ? (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Ends</th><th>Status</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {d.promos.map((p) => {
                    const [tone, label] = state(p);
                    return (
                      <tr key={p.id} className="is-static">
                        <td className="ad-strong ad-mono">{p.code}</td>
                        <td>{p.pct}% off</td>
                        <td>{p.uses}{p.limit ? ` of ${p.limit}` : ''}</td>
                        <td className="ad-nowrap">{p.ends ? dateLong(p.ends) : 'No end date'}</td>
                        <td><Badge tone={tone}>{label}</Badge></td>
                        <td className="is-num">
                          {removing === p.id ? (
                            <Confirm text="Delete this code?" onYes={() => { admin.deletePromo(p.id); setRemoving(null); toast('Code deleted'); }} onNo={() => setRemoving(null)} />
                          ) : (
                            <div className="ad-row-actions">
                              <Btn variant="icon" icon="edit" aria-label={`Edit ${p.code}`} onClick={() => { setError(''); setEdit({ ...p, limit: p.limit || '' }); }} />
                              <Btn variant="icon" icon="trash" aria-label={`Delete ${p.code}`} onClick={() => setRemoving(p.id)} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : <Empty icon="percent" title="No discount codes yet">Create one to share with customers.</Empty>}
        </Card>
      </div>

      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? `Edit ${edit.code}` : 'New discount code'}
        footer={<><Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn><Btn onClick={save}>Save code</Btn></>}>
        {edit && (
          <div className="ad-form ad-form--1">
            <Field label="Code" hint="Customers type this at checkout."><input className="ad-mono" value={edit.code} onChange={(e) => { setEdit({ ...edit, code: e.target.value.toUpperCase() }); setError(''); }} autoFocus /></Field>
            <Field label="Discount (%)"><input type="number" min="1" max="90" value={edit.pct} onChange={(e) => { setEdit({ ...edit, pct: Number(e.target.value) }); setError(''); }} /></Field>
            <Field label="Usage limit" hint="Leave empty for no limit."><input type="number" min="1" value={edit.limit} onChange={(e) => setEdit({ ...edit, limit: e.target.value })} /></Field>
            <Field label="Ends on" hint="Leave empty to keep it running."><input type="date" value={edit.ends} min={today} onChange={(e) => setEdit({ ...edit, ends: e.target.value })} /></Field>
            <Toggle label="Active" checked={edit.active} onChange={(v) => setEdit({ ...edit, active: v })} />
            {error && <p className="ad-error" role="alert">{error}</p>}
          </div>
        )}
      </Drawer>
    </>
  );
}

import { useState } from 'react';
import Icon from '../../components/ui/Icon.jsx';
import * as admin from '../../services/admin.js';
import { Avatar, Badge, Btn, Card, Confirm, Drawer, Field, PageHead, SaveBar, Tabs, Toggle, useDraft, useToast } from '../ui.jsx';

const SECTIONS = [
  { key: 'store', label: 'Store details' }, { key: 'shipping', label: 'Shipping' }, { key: 'payments', label: 'Payments' },
  { key: 'social', label: 'Social links' }, { key: 'notify', label: 'Notifications' }, { key: 'team', label: 'Team' },
];
const ROLES = { Owner: 'Everything, including settings and team.', Manager: 'Orders, products, discounts and website content.', Support: 'Orders, customers and messages.' };

export default function Settings() {
  const [tab, setTab] = useState('store');
  return (
    <>
      <PageHead title="Settings" sub="Store details, shipping, payments and who can sign in." />
      <div className="ad-settings-tabs"><Tabs value={tab} onChange={setTab} items={SECTIONS} /></div>
      {tab === 'team' && <Team />}
      <SettingsForm tab={tab} />
    </>
  );
}

function SettingsForm({ tab }) {
  const toast = useToast();
  const source = admin.useAdmin((d) => d.settings);
  const { draft, set, dirty, reset } = useDraft(source);
  const [wipe, setWipe] = useState(false);
  const save = () => { admin.saveSettings(draft); toast('Settings saved'); };

  return (
    <>
      {tab === 'store' && (
        <div className="ad-stack">
          <Card title="Business">
            <div className="ad-form">
              <Field label="Store name"><input value={draft.store.name} onChange={set('store.name')} /></Field>
              <Field label="Legal name"><input value={draft.store.legal} onChange={set('store.legal')} /></Field>
              <Field label="Support email" hint="Shown on the help page and in order emails."><input type="email" value={draft.store.email} onChange={set('store.email')} placeholder="support@primalone.in" /></Field>
              <Field label="Support phone"><input type="tel" value={draft.store.phone} onChange={set('store.phone')} placeholder="+91" /></Field>
              <Field label="GSTIN"><input value={draft.store.gstin} onChange={set('store.gstin')} className="ad-mono" /></Field>
              <Field label="FSSAI licence number"><input value={draft.store.fssai} onChange={set('store.fssai')} className="ad-mono" /></Field>
              <Field label="Registered office address" wide><textarea rows={3} value={draft.store.address} onChange={set('store.address')} /></Field>
            </div>
          </Card>
          <Card title="Grievance officer">
            <p className="ad-muted">Indian e-commerce rules require these details on the Privacy and Terms pages.</p>
            <div className="ad-form ad-mt">
              <Field label="Name"><input value={draft.grievance.name} onChange={set('grievance.name')} /></Field>
              <Field label="Email"><input type="email" value={draft.grievance.email} onChange={set('grievance.email')} /></Field>
            </div>
          </Card>
          <Card title="Demo data">
            <p className="ad-muted">Put every order, product, page and setting back to the starting sample data.</p>
            {wipe
              ? <Confirm text="Reset all demo data?" yes="Reset" onYes={() => { admin.resetDemo(); setWipe(false); toast('Demo data reset'); }} onNo={() => setWipe(false)} />
              : <Btn variant="ghost" icon="refresh" className="ad-mt" onClick={() => setWipe(true)}>Reset demo data</Btn>}
          </Card>
        </div>
      )}

      {tab === 'shipping' && (
        <Card title="Shipping">
          <div className="ad-form">
            <Field label="Flat shipping charge (₹)" hint="0 means free shipping."><input type="number" min="0" value={draft.shipping.flat} onChange={set('shipping.flat')} /></Field>
            <Field label="Free shipping above (₹)" hint="0 means no threshold."><input type="number" min="0" value={draft.shipping.freeAbove} onChange={set('shipping.freeAbove')} /></Field>
            <Field label="Processing time" hint="Shown on the shop and shipping pages."><input value={draft.shipping.processing} onChange={set('shipping.processing')} /></Field>
          </div>
          <Toggle label="Cash on delivery" hint="The site currently says cash on delivery is not offered." checked={draft.shipping.cod} onChange={set('shipping.cod')} />
        </Card>
      )}

      {tab === 'payments' && (
        <div className="ad-stack">
          <Card title="Payment gateway">
            <div className="ad-gateway">
              <span className="ad-gateway__logo"><Icon name="card" size={20} /></span>
              <div><b>{draft.payments.gateway}</b><span>Takes UPI, cards and net banking payments.</span></div>
              <Badge tone={draft.payments.connected ? 'green' : 'amber'}>{draft.payments.connected ? 'Connected' : 'Not connected'}</Badge>
            </div>
            <p className="ad-muted ad-mt">Connecting needs the gateway keys and the backend. Until then orders are saved without payment.</p>
          </Card>
          <Card title="Payment methods">
            <Toggle label="UPI" checked={draft.payments.upi} onChange={set('payments.upi')} />
            <Toggle label="Credit and debit cards" checked={draft.payments.card} onChange={set('payments.card')} />
            <Toggle label="Net banking" checked={draft.payments.netbanking} onChange={set('payments.netbanking')} />
          </Card>
        </div>
      )}

      {tab === 'social' && (
        <Card title="Social links" >
          <p className="ad-muted">Shown as icons in the footer.</p>
          <div className="ad-form ad-form--1 ad-mt">
            {draft.socials.map((s, i) => (
              <Field key={s.id} label={s.label}>
                <div className="ad-input-icon"><Icon name={s.id} size={17} /><input type="url" value={s.href} onChange={set(`socials.${i}.href`)} /></div>
              </Field>
            ))}
          </div>
        </Card>
      )}

      {tab === 'notify' && (
        <Card title="Email me when">
          <Toggle label="A new order is placed" checked={draft.notify.newOrder} onChange={set('notify.newOrder')} />
          <Toggle label="A pack runs low on stock" checked={draft.notify.lowStock} onChange={set('notify.lowStock')} />
          <div className="ad-inline ad-inline--sub">
            <Field label="Low stock means" hint="Packs at or below this number are flagged on the dashboard and products."><input type="number" min="0" value={draft.lowStock} onChange={set('lowStock')} /></Field>
          </div>
          <Toggle label="A customer sends a message" checked={draft.notify.message} onChange={set('notify.message')} />
          <Toggle label="Daily sales summary" hint="Sent at 9 am." checked={draft.notify.daily} onChange={set('notify.daily')} />
        </Card>
      )}
      <SaveBar dirty={dirty} onSave={save} onReset={reset} />
    </>
  );
}

function Team() {
  const toast = useToast();
  const team = admin.useAdmin((d) => d.team);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(null);
  const owners = team.filter((t) => t.role === 'Owner').length;
  const save = () => {
    const email = edit.email.trim().toLowerCase();
    if (!edit.name.trim()) return setError('Please enter a name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    if (team.some((t) => t.email === email && t.id !== edit.id)) return setError('This person is already on the team.');
    const next = edit.id ? team.map((t) => (t.id === edit.id ? { ...edit, email } : t)) : [...team, { ...edit, email, id: `t${Date.now()}`, active: true }];
    admin.saveTeam(next);
    toast(edit.id ? 'Team member updated' : `Invite saved for ${edit.name}`);
    setEdit(null);
    return undefined;
  };
  return (
    <>
      <Card title="Team" action={<Btn icon="plus" onClick={() => { setError(''); setEdit({ name: '', email: '', role: 'Support' }); }}>Add person</Btn>} pad={false}>
        <ul className="ad-team">
          {team.map((t) => (
            <li key={t.id}>
              <div className="ad-who"><Avatar name={t.name} size={38} /><div><b>{t.name}</b><span>{t.email}</span></div></div>
              <Badge tone={t.role === 'Owner' ? 'gold' : t.role === 'Manager' ? 'blue' : 'grey'}>{t.role}</Badge>
              {removing === t.id ? (
                <Confirm text="Remove access?" yes="Remove" onYes={() => { admin.saveTeam(team.filter((x) => x.id !== t.id)); setRemoving(null); toast('Access removed'); }} onNo={() => setRemoving(null)} />
              ) : (
                <div className="ad-row-actions">
                  <Btn variant="icon" icon="edit" aria-label={`Edit ${t.name}`} onClick={() => { setError(''); setEdit({ ...t }); }} />
                  <Btn variant="icon" icon="trash" aria-label={`Remove ${t.name}`} disabled={t.role === 'Owner' && owners === 1} title={t.role === 'Owner' && owners === 1 ? 'The store needs at least one owner' : undefined} onClick={() => setRemoving(t.id)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit team member' : 'Add a team member'}
        footer={<><Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn><Btn onClick={save}>{edit?.id ? 'Save' : 'Add person'}</Btn></>}>
        {edit && (
          <div className="ad-form ad-form--1">
            <Field label="Name"><input value={edit.name} onChange={(e) => { setEdit({ ...edit, name: e.target.value }); setError(''); }} autoFocus /></Field>
            <Field label="Email"><input type="email" value={edit.email} onChange={(e) => { setEdit({ ...edit, email: e.target.value }); setError(''); }} /></Field>
            <div className="ad-radios">
              {Object.entries(ROLES).map(([r, h]) => (
                <label key={r} className={edit.role === r ? 'is-on' : ''}>
                  <input type="radio" name="role" checked={edit.role === r} disabled={edit.id && edit.role === 'Owner' && owners === 1 && r !== 'Owner'} onChange={() => setEdit({ ...edit, role: r })} />
                  <span><b>{r}</b><small>{h}</small></span>
                </label>
              ))}
            </div>
            {error && <p className="ad-error" role="alert">{error}</p>}
          </div>
        )}
      </Drawer>
    </>
  );
}
